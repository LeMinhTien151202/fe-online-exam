# Hướng dẫn tích hợp Auth cho Frontend

Tài liệu cho FE nối API **đăng ký / đăng nhập / refresh / logout / Google**.

---

## 0. Kiến thức nền

- **Base URL**: `http://localhost:3000/api/v1` (đổi theo môi trường).
- **Mọi response thành công** đều bọc theo cấu trúc:
  ```json
  {
    "code": 200,
    "success": true,
    "message": "Thông điệp",
    "messages": [],
    "data": {},
    "metaData": null
  }
  ```
  → Dữ liệu thật nằm trong **`data`**. FE luôn đọc `res.data.data`.

- **Cơ chế token (2 loại):**
  | Token | Nơi lưu | Vai trò | Hạn |
  | :-- | :-- | :-- | :-- |
  | **access_token** | FE tự lưu (memory / localStorage) | Gửi kèm mỗi request cần đăng nhập | ngắn (vd 50 phút) |
  | **refresh_token** | **Cookie httpOnly** (BE tự set, JS không đọc được) | Xin access_token mới khi hết hạn | dài (7 ngày) |

- **Gửi access_token**: header `Authorization: Bearer <access_token>`.
- **QUAN TRỌNG — Cookie**: refresh_token nằm trong cookie httpOnly, nên FE **phải bật gửi cookie**:
  - `fetch(url, { credentials: 'include' })`
  - hoặc `axios` với `withCredentials: true`.
  - BE đã bật CORS `credentials: true`.

---

## 1. Đăng ký — `POST /auth/register`

Tạo tài khoản **STUDENT** (không cần đăng nhập).

**Request body:**
```json
{
  "email": "student@test.com",
  "password": "123456",
  "full_name": "Nguyen Van A"
}
```

**Response `data`:**
```json
{
  "id": 1,
  "email": "student@test.com",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2026-07-02T10:00:00.000Z",
  "profile": { "userId": 1, "fullName": "Nguyen Van A" }
}
```

> Đăng ký xong **chưa có token** — cần gọi tiếp `/auth/login`.

---

## 2. Đăng nhập — `POST /auth/login`

⚠️ **Trường là `username` (không phải `email`)** — điền email vào `username`.

**Request body:**
```json
{
  "username": "student@test.com",
  "password": "123456"
}
```

**Response `data`:**
```json
{
  "access_token": "eyJhbGciOiJ...",
  "refresh_token": "eyJhbGciOiJ...",
  "user": { "id": 1, "email": "student@test.com", "role": "STUDENT" }
}
```

- BE đồng thời set **cookie httpOnly `refresh_token`** (FE không cần tự lưu cái này).
- FE lưu `access_token` (biến state / localStorage) để gắn vào header các request sau.

**Ví dụ (fetch):**
```js
const res = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // BẮT BUỘC để nhận cookie refresh_token
  body: JSON.stringify({ username: 'student@test.com', password: '123456' }),
});
const body = await res.json();
const accessToken = body.data.access_token;
const user = body.data.user;
```

---

## 3. Gọi API cần đăng nhập

Gắn access_token vào header:
```js
const res = await fetch('http://localhost:3000/api/v1/auth/account', {
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: 'include',
});
```

### Lấy thông tin tài khoản — `GET /auth/account`
Response `data` = user + profile (dùng để hiển thị sau khi login/refresh trang).

---

## 4. Làm mới token — `GET /auth/refresh`

Khi access_token **hết hạn** (gọi API bị **401**), gọi refresh để lấy access_token mới.
Không cần gửi gì trong body — BE đọc **cookie `refresh_token`** tự động.

```js
const res = await fetch('http://localhost:3000/api/v1/auth/refresh', {
  credentials: 'include', // gửi kèm cookie refresh_token
});
const body = await res.json();
const newAccessToken = body.data.access_token; // lưu lại
```

- Nếu refresh_token cũng hết hạn / không hợp lệ → **401** → điều hướng về trang đăng nhập.

---

## 5. Đăng xuất — `POST /auth/logout`

```js
await fetch('http://localhost:3000/api/v1/auth/logout', {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: 'include',
});
// FE tự xóa access_token đang lưu.
```
BE xóa cookie `refresh_token`.

---

## 6. Đổi mật khẩu — `PATCH /auth/change-password`

```json
{ "oldPassword": "123456", "newPassword": "123456new" }
```
Cần đăng nhập (gửi Bearer token).

---

## 7. Đăng nhập bằng Google

Flow OAuth chuẩn (chuyển hướng trình duyệt):

1. FE điều hướng người dùng tới:
   ```
   http://localhost:3000/api/v1/auth/google
   ```
   (dùng `window.location.href = ...`, KHÔNG dùng fetch/ajax.)
2. Người dùng chọn tài khoản Google → BE xử lý → callback.
3. Kết quả:
   - Nếu BE cấu hình `GOOGLE_SUCCESS_REDIRECT` → **redirect về FE** kèm token:
     ```
     https://your-fe.com/oauth?access_token=eyJ...
     ```
     FE đọc `access_token` từ query, lưu lại, gọi `/auth/account` để lấy user.
   - Nếu chưa cấu hình redirect → BE trả JSON `{ data: { access_token, user } }` (chủ yếu để test).

> Khuyến nghị: đặt `GOOGLE_SUCCESS_REDIRECT` = trang xử lý OAuth của FE để có UX mượt.

---

## 8. Xử lý lỗi

**Lỗi KHÔNG bọc theo cấu trúc success** — dùng shape mặc định của NestJS:
```json
{ "statusCode": 400, "message": "Email đã được sử dụng", "error": "Bad Request" }
```
- Lỗi validate (nhiều lỗi) → `message` là **mảng chuỗi**:
  ```json
  { "statusCode": 400, "message": ["Email không đúng định dạng"], "error": "Bad Request" }
  ```
- `401` → token sai/hết hạn → thử refresh, thất bại thì về trang login.
- `403` → không đủ quyền (khi bật RolesGuard).

FE nên đọc lỗi: `err.response.data.message` (chuỗi hoặc mảng).

---

## 9. Ví dụ axios interceptor tự refresh (khuyến nghị)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true, // gửi cookie refresh_token
});

let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };

// Gắn Bearer token vào mọi request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Gặp 401 -> refresh 1 lần rồi thử lại
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      try {
        const r = await api.get('/auth/refresh');
        setAccessToken(r.data.data.access_token);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original); // gọi lại request cũ
      } catch (e) {
        // refresh thất bại -> điều hướng về login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

Cách dùng:
```js
// Đăng nhập
const { data } = await api.post('/auth/login', { username, password });
setAccessToken(data.data.access_token);

// Các request sau tự có token + tự refresh khi hết hạn
const me = await api.get('/auth/account');
```

---

## 10. Tóm tắt endpoint Auth

| Method | Path | Cần token? | Ghi chú |
| :-- | :-- | :-- | :-- |
| POST | `/auth/register` | Không | Tạo STUDENT |
| POST | `/auth/login` | Không | Field `username` = email; set cookie refresh |
| GET | `/auth/account` | Có | Thông tin user + profile |
| GET | `/auth/refresh` | Không (dùng cookie) | Trả access_token mới |
| POST | `/auth/logout` | Có | Xóa cookie refresh |
| PATCH | `/auth/change-password` | Có | Đổi mật khẩu |
| GET | `/auth/google` | Không | Redirect đăng nhập Google |

> Tài liệu API đầy đủ (thử trực tiếp): **`http://localhost:3000/api/docs`** (Swagger).
