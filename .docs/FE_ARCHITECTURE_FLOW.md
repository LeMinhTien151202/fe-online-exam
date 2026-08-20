# Kiến trúc & Luồng đi của Frontend (FE_ARCHITECTURE_FLOW)

> Repo: `D:\react-exam-online`. Mọi đường dẫn tính từ gốc repo.
> Tài liệu này mô tả **luồng chạy của code từ UI xuống API**. Sơ đồ thư mục tổng quát xem `.docs/ARCHITECTURE.md`; quy ước code xem `.docs/STYLEGUIDE.md`.
> Phía backend xem `.docs/BE_ARCHITECTURE_FLOW.md`.

---

## 1. Stack

| Hạng mục | Thư viện | Vai trò |
|---|---|---|
| Nền | React 19 + TypeScript + Vite 8 | |
| Routing | `@tanstack/react-router` | Route tree khai báo bằng code, type-safe |
| Server state | `@tanstack/react-query` v5 | Cache dữ liệu API — **nguồn dữ liệu chính** |
| Client state | Redux Toolkit (**chỉ 1 slice: `auth`**) | Người dùng hiện tại + trạng thái đăng nhập |
| HTTP | `axios` | 1 instance duy nhất + interceptor |
| UI | Ant Design 6 | Component chuẩn, ưu tiên dùng trước |
| CSS | `styled-components` | Style riêng theo màn |
| Form | `react-hook-form` + `zod` | Validation |
| Chart | `@ant-design/plots`, `recharts` | Dashboard |
| i18n | `i18next` | Đa ngôn ngữ |

Alias đường dẫn (`vite.config.ts`): `@` → `src/`, `@apps` → `src/apps/`, `@shared` → `src/shared/`.

---

## 2. Tổ chức mã: Module-based + Shared Kernel

```
src/
├── apps/                     # Các module nghiệp vụ, mỗi module là 1 khu chức năng
│   ├── auth/                 #   đăng nhập, đăng ký, OAuth
│   ├── home/                 #   trang chủ học viên
│   ├── admin/                #   khu quản trị (users, questions, exams, grading…)
│   ├── reading-practice/     #   5 module luyện kỹ năng, cấu trúc giống hệt nhau
│   ├── listening-practice/
│   ├── speaking-practice/
│   ├── writing-practice/
│   ├── grammar-practice/
│   ├── full-mock-exam/       #   thi thử full
│   ├── materials/  faq/
├── shared/                   # Shared Kernel — dùng chung TOÀN app
│   ├── auth/                 #   RootAuthGate, RequireRole, roleAccess
│   ├── components/           #   Form/*, QuestionBoard, ExamState, Pagination…
│   ├── hooks/                #   useAuthBootstrap, usePagination, useLogout…
│   ├── providers/            #   QueryProvider
│   ├── router/root.ts        #   rootRoute
│   ├── services/             #   API dùng chung: media/, student-exam/
│   ├── store/                #   Redux: store.ts, authSlice.ts, hooks.ts
│   └── utils/                #   tokenManager, cefrScale, skillScore, zod…
├── configs/                  # axios.ts, antDesign.ts, notification.ts, toast.ts
├── App.tsx                   # Ghép route tree + bọc providers
└── main.tsx                  # Entry
```

### 2.1. Cấu trúc đệ quy của một trang

Đây là quy ước **quan trọng nhất**. Mỗi trang trong `apps/*/pages/<tên-trang>/` đều lặp lại đúng bộ khung sau — ví dụ `apps/admin/pages/admin-users/`:

```
admin-users/
├── services/          # TẦNG API
│   ├── types.ts       #   interface DTO khớp backend
│   ├── userApi.ts     #   hàm gọi axios thuần (list/detail/create/update/lock)
│   └── userQuery.ts   #   bọc bằng React Query (useUsersQuery, useCreateUserMutation…)
├── hook/              # TẦNG LOGIC
│   ├── useUsers.ts       #   useData + useAction: fetch, map row, state modal, handler
│   └── useUserColumns.tsx#   useColumn: định nghĩa cột bảng
├── components/        # DUMB COMPONENT — chỉ nhận props và render
│   ├── UserList.tsx  UserModal.tsx  UserDetailModal.tsx  RoleInfo.tsx
├── styles/styled.ts   # styled-components riêng của trang
└── pages/Index.tsx    # SMART COMPONENT — ráp hook + component, KHÔNG chứa logic
```

`pages/Index.tsx` gần như chỉ có 2 dòng logic:

```tsx
const { students, isLoading, total, page, handleCreate, ... } = useUsers();
const columns = useUserColumns(handleOpenDetail, handleStatusChange);
```

Toàn bộ fetch / map / state / mutation nằm trong `useUsers`. Component không bao giờ gọi `useQuery` trực tiếp.

---

## 3. Khởi động ứng dụng

`main.tsx` → `App.tsx`. Thứ tự bọc provider trong `App.tsx` **có ý nghĩa**:

```tsx
<ReduxProvider store={store}>          {/* 1. authSlice sẵn sàng trước mọi thứ  */}
  <QueryProvider>                      {/* 2. QueryClient                        */}
    <ConfigProvider theme={antThemeConfig}>
      <AntdApp style={{ display: 'contents' }}>
        <AuthBootstrap />              {/* 3. khôi phục phiên đăng nhập          */}
        <NotificationBridge />         {/* 4. đưa notification ra ngoài React    */}
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </QueryProvider>
</ReduxProvider>
```

**`NotificationBridge`** là chi tiết dễ bỏ sót: axios interceptor nằm **ngoài** cây React nên không dùng được `AntdApp.useApp()`. Bridge lấy instance `notification` rồi đẩy qua `configs/notification.ts` (`setAppNotification`) để interceptor gọi được — nếu bỏ đi, antd v6 sẽ cảnh báo "Static function can not consume context" và notification mất theme.

Route tree ráp trong `App.tsx` bằng `rootRoute.addChildren([...])` — mỗi module export route riêng trong `apps/*/routes.tsx`, `App.tsx` chỉ gom lại.

---

## 4. Luồng một lời gọi API (đường đi chính)

```
Component (pages/Index.tsx)
   │  đọc dữ liệu + gọi handler
   ▼
Hook logic (hook/useUsers.ts)          ← state UI, map DTO -> row, gom handler
   │
   ▼
Query hook (services/userQuery.ts)     ← useQuery / useMutation + queryKey + invalidate
   │
   ▼
API function (services/userApi.ts)     ← axiosInstance.get('/users', { params })
   │
   ▼
axios instance (configs/axios.ts)
   ├─ REQUEST interceptor : gắn Authorization: Bearer <token> từ tokenManager
   │
   ├──────────► Backend :6969/api/v1
   │
   └─ RESPONSE interceptor:
         ├─ Thành công -> BÓC envelope, trả thẳng `data`
         └─ Lỗi        -> thử refresh 401 / bắn notification / reject
```

### 4.1. Tầng axios — `src/configs/axios.ts`

Chỉ có **một** instance, `baseURL = VITE_API_URL || http://localhost:6969/api/v1`, `withCredentials: true` (để cookie refresh httpOnly được gửi kèm), timeout mặc định **10s**.

### 4.2. Bóc envelope & cờ `_rawEnvelope`

Backend luôn trả `{ code, success, message, data, metaData }`. Response interceptor bóc sẵn một lớp:

```ts
return response.config?._rawEnvelope ? body : body.data;
```

→ **Mặc định** hàm API nhận thẳng `data`, không phải viết `res.data.data` khắp nơi.
→ **Danh sách phân trang** cần `metaData` thì đặt `_rawEnvelope: true` (khai báo mở rộng type của axios ngay trong file này):

```ts
list: (filter) => axiosInstance.get<IApiEnvelope<IAdminUser[]>, IApiEnvelope<IAdminUser[]>>(
  '/users', { params: filter, _rawEnvelope: true }
),
// dùng: data.data (mảng) + data.metaData.total
```

> Tham số generic thứ hai của `axios.get<T, R>` phải lặp lại kiểu — vì interceptor đã đổi kiểu trả về, TypeScript cần được nói rõ.

### 4.3. Tự động refresh token khi 401

```
Request bất kỳ -> 401
   ├─ URL thuộc /auth/login, /auth/register, /auth/refresh?  -> KHÔNG refresh (tránh vòng lặp)
   └─ Còn lại:
        ├─ đánh dấu _retried = true (chỉ thử ĐÚNG 1 lần)
        ├─ getRefreshedAccessToken():
        │     • gộp nhiều request cùng lúc vào 1 promise duy nhất  (refreshPromise)
        │     • khoá liên-tab bằng navigator.locks  (cookie refresh dùng chung giữa các tab)
        │     • so token mới nhất với token đã hỏng -> tab khác vừa refresh xong thì dùng luôn
        │     • GET /auth/refresh (kèm cookie) -> lưu access_token mới
        ├─ Refresh OK  -> GỌI LẠI request cũ, người dùng không thấy gì
        └─ Refresh 401 -> store.dispatch(logout())   ← CHỈ xoá phiên khi backend xác nhận hết hạn
```

Lỗi mạng / timeout / 5xx khi refresh **không** xoá phiên — tránh đá người dùng ra `/login` chỉ vì rớt wifi.

### 4.4. Thông báo lỗi tập trung

Không màn nào phải `try/catch` để hiện lỗi. Interceptor tự quyết định:

- `resolveErrorTitle()` — tiêu đề theo status: 400 "Dữ liệu không hợp lệ", 403 "Không đủ quyền", 413 "Tệp quá lớn", 5xx "Lỗi máy chủ", không có response thì phân biệt "Quá thời gian chờ" vs "Mất kết nối".
- `resolveErrorMessage()` — **ưu tiên message thật từ backend** (`error.response.data.message`), chỉ dùng câu chung khi không còn thông tin. Đây là lý do BE phải trả message tiếng Việt hướng người dùng.
- **401 im lặng:** chỉ `/auth/login` và `/auth/register` mới bắn notification khi 401 (sai mật khẩu). Mọi 401 khác là "phiên hết hạn / khách chưa đăng nhập" → xử lý ngầm, không dọa người dùng.

### 4.5. Tầng React Query — `services/*Query.ts`

```ts
export const USERS_KEY = ['admin', 'users'];

export const useUsersQuery = (filter = {}) =>
  useQuery({ queryKey: [...USERS_KEY, filter], queryFn: () => userApi.list(filter) });

export const useCreateUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => userApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),   // ← làm mới danh sách
  });
};
```

Quy ước:
- `queryKey` xuất phát từ **hằng số exported** (`USERS_KEY`), filter nối vào sau → đổi filter là tự refetch.
- Mutation **luôn** `invalidateQueries` theo key gốc thay vì gọi `refetch()` thủ công.
- Mặc định của `QueryProvider`: `staleTime: 5 phút`, `retry: 1`, **không** `refetchOnWindowFocus`.

### 4.6. Tầng hook logic — `hook/use*.ts`

Chia vai trò rõ ràng (đúng `.agent/skills/react-frontend-skill.md`):

| Hook | Trách nhiệm |
|---|---|
| `useData` / `use<Feature>` | gọi query hook, `useMemo` map DTO → row cho bảng, lấy `total` từ `metaData` |
| `useAction` | state modal, handler `onClick/onSubmit`, gọi mutation, `toast.success` khi xong |
| `useColumn` | định nghĩa `columns` của Ant Table (file `.tsx` vì có JSX) |

Trong dự án, trang nhỏ gộp `useData` + `useAction` vào một hook (`useUsers.ts`), trang lớn thì tách. Phân trang lấy từ `shared/hooks/usePagination.ts`.

---

## 5. Xác thực & phân quyền

### 5.1. Nơi cất token

`shared/utils/tokenManager.ts` — access token nằm ở `localStorage['access_token']`, có biến cache trong module để tránh đọc `localStorage` mỗi request. Refresh token **không** do FE quản lý (cookie httpOnly).

### 5.2. Khôi phục phiên khi F5

```
App khởi động
   └─ <AuthBootstrap /> -> useAuthBootstrap()
         └─ useAccountQuery()  = GET /auth/account
               ├─ Có token hợp lệ  -> dispatch(setUser(user))
               ├─ Token hết hạn    -> interceptor tự refresh bằng cookie -> vẫn có user
               └─ 401 thật sự      -> dispatch(logout())
         Lỗi mạng/5xx -> GIỮ NGUYÊN phiên, không logout
```

`useAccountQuery` được gọi ở 3 nơi (`useAuthBootstrap`, `RootAuthGate`, `RequireRole`) nhưng **cùng queryKey** nên React Query dedupe thành 1 request duy nhất.

### 5.3. Hai lớp guard

**Lớp 1 — `RootAuthGate`** (`shared/auth/RootAuthGate.tsx`), đặt làm `component` của `rootRoute` nên chặn cả điều hướng nội bộ lẫn gõ URL trực tiếp:

- Public: `/` (trang chủ), `/login`, `/register`, `/oauth`, `/faq`.
- Còn lại bắt buộc đăng nhập → chưa có user thì `navigate('/login', { replace: true })`.
- Trong lúc `bootstrapping` (đang có token nhưng redux chưa có user) → hiện spinner, **chưa kết luận** — nếu không sẽ đá nhầm người đang đăng nhập ra `/login` mỗi lần F5.

**Lớp 2 — `RequireRole`** (`shared/auth/RequireRole.tsx`), bọc từng route trong `apps/admin/routes.tsx` qua helper `guard(Component, allow)`:

```tsx
export const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: guard(AdminUsersPage, ROLE_ACCESS.adminOnly),
});
```

Sai vai trò → đẩy về trang mặc định của vai trò đó (`roleHomePath`).

### 5.4. `roleAccess.ts` — nguồn phân quyền duy nhất của FE

```ts
ROLE_ACCESS.adminOnly        = ['ADMIN']                 // users, settings, notifications
ROLE_ACCESS.contentManagers  = ['ADMIN', 'TEACHER']      // questions, exams, materials, grading, faq
ROLE_ACCESS.students         = ['STUDENT']               // khu luyện thi
```

Ánh xạ **1-1** với `@PreAuthorize` ở backend. FE guard chỉ để trải nghiệm mượt (ẩn menu, chặn sớm) — **backend mới là lớp bảo vệ thật**.

> ⚠️ Hiện `BYPASS_ROLE = true` trong `shared/auth/roleAccess.ts`: RBAC phía FE đang **tắt tạm** (chỉ cần đăng nhập là vào được). Đổi về `false` để bật lại.

---

## 6. Luồng làm bài & nộp bài (học viên)

Dùng chung qua `shared/services/student-exam/`:

```
Vào trang luyện tập
   ├─ studentExamApi.listPartPractice(skillId)   GET /exams?type=PART_PRACTICE&skillId=..
   │     -> tra examId theo partNumber
   ├─ studentExamApi.take(id)                    GET /exams/{id}/take  (đã ẩn answer key)
   ├─ useMyExamProgressQuery()                   GET /progress/exams/me  -> % từng đề
   └─ useMyStreakQuery()                         GET /streaks/me

Làm bài
   └─ Speaking/Writing có ghi âm:
        MediaRecorder -> Blob -> uploadAudioBlob()  (shared/services/media/mediaApi.ts)
           POST /files/student-answers
           BE tự gắn prefix student-answers/{studentId}; FE không được tự chọn thư mục
           ⚠ headers: { 'Content-Type': null } — để axios tự sinh boundary, ép thủ công sẽ 400
        -> nhận về URL công khai, dùng URL đó làm `response` của câu hỏi

Nộp bài
   └─ studentExamApi.submit(examId, payload)     POST /exams/{examId}/submit
        • timeout RIÊNG 300_000ms (SUBMIT_TIMEOUT_MS) — phải > ngân sách chấm AI của BE (~181s)
        • BE tự phân luồng theo type đề (PART_PRACTICE / SKILL_FULL_SET / MOCK_TEST)
        • Response trả review NÓNG: điểm trắc nghiệm + kết quả AI ngay trong 1 lần gọi
   └─ invalidate ATTEMPTS_KEY / PROGRESS_KEY / EXAM_PROGRESS_KEY / STREAK_KEY
```

Riêng nút **Điền đáp án mẫu** trong thi thử full chỉ hiện khi chạy `vite dev`. Khi bấm, FE gọi
`GET /test-support/exams/{id}/answer-key` rồi truyền answer key vào các section; không lấy đáp án
từ response `/exams/{id}/take`. Backend không tạo endpoint test này ở staging/production. Có thể
ẩn nút ở local bằng `VITE_ENABLE_EXAM_PREFILL=false`.

**Lớp chuẩn hoá dữ liệu:** BE có chỗ trả mảng trực tiếp, có chỗ bọc `{ result }`, có chỗ `camelCase`/`snake_case` lẫn lộn. `studentExamQuery.ts` có sẵn `normalizeExamProgress()` / `normalizeProgress()` và `studentExamApi.myAttempts()` tự chuẩn hoá về một dạng — **không để component tự đoán hình dạng dữ liệu**.

---

## 7. Chuẩn UI

- **Ant Design trước tiên**, `styled-components` chỉ cho phần AntD không lo được. Theme chung ở `configs/antDesign.ts`.
- Nền toàn app: `#f8fafc` (slate-50) — trang chủ, 5 trang kỹ năng và admin đều dùng.
- Card **trang chủ**: chỉ `box-shadow` 2 lớp (`0 0 1px rgba(0,0,0,.04)` + `0 2px 8px rgba(0,0,0,.06)`), **không** border.
- Card **trang kỹ năng** (`MockTestCard`, `StatPill`): `border: 1px solid rgba(0,0,0,.05)` + `box-shadow: 0 4px 15px rgba(0,0,0,.01)`, bo `1rem`.
  → Hai nhóm **cố ý khác nhau**, đừng lan chuẩn của nhóm này sang nhóm kia.
- Thông báo: `toast` (`configs/toast.ts`) cho hành động thành công; lỗi để interceptor tự lo.

---

## 8. Checklist khi thêm một màn hình mới

1. Tạo thư mục `apps/<module>/pages/<ten-trang>/` với đủ `services/ hook/ components/ styles/ pages/`.
2. `services/types.ts` — interface khớp DTO backend (đối chiếu `.docs/API_PLAN.md`).
3. `services/xxxApi.ts` — hàm axios thuần. Danh sách phân trang nhớ `_rawEnvelope: true`.
4. `services/xxxQuery.ts` — export hằng `XXX_KEY`, hook `useXxxQuery` / `useXxxMutation` (mutation phải `invalidateQueries`).
5. `hook/useXxx.ts` — map dữ liệu, state, handler. `hook/useXxxColumns.tsx` nếu có bảng.
6. `components/*` — dumb, chỉ nhận props.
7. `pages/Index.tsx` — smart, chỉ gọi hook rồi ráp component.
8. Khai báo route trong `apps/<module>/routes.tsx`, bọc `guard(Component, ROLE_ACCESS.<nhóm>)` nếu cần quyền, rồi thêm vào route tree ở `App.tsx`.
9. Chạy kiểm tra: `npx tsc --noEmit` và `npm run lint`.

### Những lỗi hay gặp

| Triệu chứng | Nguyên nhân |
|---|---|
| `data` là `undefined` khi cần `metaData` | Quên `_rawEnvelope: true` |
| Upload trả 400 | Tự set `'Content-Type': 'multipart/form-data'` → mất boundary. Phải để `null` |
| Nộp bài Speaking bị timeout | Dùng timeout mặc định 10s thay vì SUBMIT_TIMEOUT_MS (300s) |
| Bị đá ra `/login` mỗi lần F5 | Quyết định điều hướng khi chưa xong `bootstrapping` |
| Sửa xong nhưng danh sách không đổi | Mutation thiếu `invalidateQueries` |
| Notification lỗi không có theme / cảnh báo antd | Thiếu `NotificationBridge` |
