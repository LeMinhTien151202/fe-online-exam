# Kiến trúc hệ thống Frontend (Frontend Architecture)

## 1. Sơ đồ tư duy Cấu trúc thư mục (Directory Structure)

Dự án áp dụng mô hình **Domain-Driven Design (DDD)** kết hợp với **Shared Kernel**, chia tách rõ ràng ranh giới giữa các module nghiệp vụ và resource dùng chung.

```text
/src
├── apps/                        # Các Domain/Module nghiệp vụ (Micro-frontends pattern)
│   ├── admin/                   # Layout chung, page quản trị
│   ├── auth/                    # Xác thực (Login, Forgot password)
│   ├── quan-ly-danh-muc-du-lieu/# Domain: Quản lý danh mục
│   │   ├── pages/               # Chứa các màn hình (ví dụ: danh-muc-ma-Sitc)
│   │   │   └── danh-muc-ma-Sitc/
│   │   │       ├── components/  # Dumb Components riêng của màn hình (Filter, Modal)
│   │   │       ├── hook/        # Logic nghiệp vụ (useData, useAction, useFilter)
│   │   │       ├── services/    # API calls & React Query hooks (api.ts, query.ts, types.ts)
│   │   │       ├── styles/      # Scoped CSS/SCSS
│   │   │       └── pages/
│   │   │           └── Index.tsx # Smart Component (Màn hình chính)
│   │   ├── Route.tsx            # Khai báo cấu trúc Route cho Domain
│   │   └── constants.ts         # Hằng số cấu hình của Domain
│   └── ... (các domain khác)
├── shared/                      # Shared Kernel (Tài nguyên dùng chung toàn cục)
│   ├── components/              # UI Components dùng chung (Tables, Form, Modals...)
│   ├── configs/                 # Cấu hình third-party (axios, reactQuery, antd)
│   ├── context/                 # Global React Context (AppContext - Quyền, User)
│   ├── hooks/                   # Custom Hooks dùng chung (useI18n, usePageTitle...)
│   ├── services/                # Base API Services dùng chung
│   ├── types/                   # Global TypeScript types/interfaces
│   └── utils/                   # Helper functions (storage, format, tokenManager)
├── assets/                      # SCSS global, Images, Fonts
├── configs/                     # App level configurations
├── constants/                   # Global constants
├── Route.tsx                    # Root Route Tree tổng hợp từ các apps
├── App.tsx                      # App layout & logic root
└── main.tsx                     # Entry point (Providers: QueryClient, Antd, Theme)
```

## 2. Luồng xử lý dữ liệu (Data Flow)

Kiến trúc quản lý luồng dữ liệu của dự án xoay quanh hệ sinh thái `@tanstack/react-query` và `axios` với quy trình nghiêm ngặt:

### 2.1. Tầng Network (Axios Instance)
- Cấu hình tại `src/configs/axios.ts`.
- Gồm 2 instance chính: `axiosClient` (Dịch vụ công/Nghiệp vụ) và `axiosNewsClient` (Tin tức).
- **Interceptors**: 
  - **Request**: Tự động đính kèm `Bearer token` từ `tokenManager` và `ngonngu` header.
  - **Response**: Tự động trích xuất `response.data`. Xử lý lỗi tập trung: tự động gọi `handleRefreshToken` nếu dính mã lỗi `401 Unathorized`; tự động bật `notification.error` nếu lỗi `500` hoặc lỗi logic hệ thống.

### 2.2. Tầng Data Fetching (React Query)
- Sử dụng `react-query` làm "Cơ sở dữ liệu Front-end" thực thụ (Server State Manager).
- Tách riêng File:
  - `api.ts`: Chứa các hàm fetch raw dùng axios (`getSITCList`, `createSITC`).
  - `query.ts`: Bọc các hàm fetch bằng custom hooks của React Query (`useSITCListQuery`, `useCreateSITCMutation`).
- **Caching & Synchronization**: Config mặc định `staleTime: Infinity`, `cacheTime: 10 mins`, không tự động `refetchOnWindowFocus`. Data được làm mới thủ công qua hàm `refetch` hoặc invalidate cache khi có Mutation (Thêm/Sửa/Xóa).

### 2.3. Tầng Tương tác Component (Custom Hooks Pattern)
- UI Component KHÔNG chứa state fetching trực tiếp.
- Thay vào đó, luồng dữ liệu từ Component tới React Query thông qua một lớp trung gian (Custom Hooks):
  - `useFilter.ts`: Quản lý bộ lọc (keyword, pagination, query params).
  - `useData.ts`: Nhận `filter`, gọi hooks `useQuery` để fetch data, sau đó `map/transform` data thô từ API thành dữ liệu chuẩn bị cho bảng (Table) hoặc UI.
  - `useAction.ts`: Chứa các hàm xử lý sự kiện người dùng (onClick, onSubmit), quản lý state mở Modal (`useState`), và gọi hooks `useMutation` để Gửi/Cập nhật dữ liệu. Cuối cùng, trigger `refetch()` làm mới danh sách.

