# Kiến trúc hệ thống Frontend (Frontend Architecture)

## 1. Sơ đồ tư duy Cấu trúc thư mục (Directory Structure)

Dự án áp dụng mô hình **Domain-Driven Design (DDD)** kết hợp với **Shared Kernel**, chia tách rõ ràng ranh giới giữa các module nghiệp vụ và resource dùng chung.

```text
/src
├── apps/                        # Các Domain/Module nghiệp vụ (Module-based Architecture)
│   ├── auth/                    # Module: Xác thực (Đã được chuẩn hóa architecture)
│   │   ├── components/          # Shared Components nội bộ của module (e.g. AuthLayout)
│   │   ├── styles/              # Layout styles chung của module
│   │   ├── pages/               # Chứa các trang con (Login, Register...)
│   │   │   ├── login/           # Trang con cũng có bộ khung architecture riêng:
│   │   │   │   ├── components/  # Các component con chỉ dùng cho trang này
│   │   │   │   ├── hook/        # Business logic (React Query hooks: useLogin)
│   │   │   │   ├── services/    # API calls & Data fetching (loginApi.ts)
│   │   │   │   ├── styles/      # Scoped styled-components (login.styled.ts)
│   │   │   │   └── pages/       # View component chính (LoginPage.tsx)
│   │   │   └── register/        # Tương tự như login...
│   │   └── routes.tsx           # Route nội bộ của module Auth
│   ├── admin/                   # Module: Quản trị
│   │   ├── components/
│   │   ├── pages/               # Từng page trong admin đều tuân thủ kiến trúc recursive
│   │   │   ├── admin-users/
│   │   │   │   ├── components/  # (e.g. UserModal, UserFilter)
│   │   │   │   ├── hook/        # (e.g. useUserTable)
│   │   │   │   ├── services/    # (e.g. userApi.ts)
│   │   │   │   ├── styles/
│   │   │   │   └── pages/
│   │   │   └── ...
│   │   └── routes.tsx
│   └── ... (các module nghiệp vụ khác)
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
