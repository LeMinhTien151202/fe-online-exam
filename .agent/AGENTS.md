# Bản Hiến pháp của dự án (Project Constitution)

## 1. Tech Stack Chính (Core Technologies)

Dự án được xây dựng dựa trên các công nghệ hiện đại và mạnh mẽ, tối ưu cho SPA (Single Page Application):

- **Core Framework**: React 19 kết hợp TypeScript.
- **Build Tool**: Vite (cực nhanh, hỗ trợ HMR tốt).
- **Routing**: `@tanstack/react-router` (Type-safe routing, quản lý route dạng tree).
- **State Management & Data Fetching**:
  - `@tanstack/react-query` (Quản lý Server State, caching, synchronization).
  - Redux Toolkit (Quản lý Global Client State phức tạp, data sharing giữa các module).
  - React Context API (Quản lý Global UI State tĩnh như User Permission, Theme).
- **UI Framework & Styling**:
  - `antd` (Ant Design v5 - Framework UI chính).
  - `@tailwindcss/postcss` (Tailwind CSS v4 - Utility-first styling).
  - `styled-components` & `Sass` (Custom styling & overriding CSS).
  - chuyển các giá trị sang rem để dễ dàng responsive cho các màn.
- **HTTP Client**: `axios` (cấu hình interceptor, xử lý refresh token tự động).
- **Form & Validation**: Sử dụng `zod` để validate dữ liệu.
- **Data Visualization**: `@ant-design/plots`, `recharts`.
- **Khác**: `i18next` (Đa ngôn ngữ), `@ckeditor/ckeditor5-react` (Rich Text Editor).

## 2. "Đạo luật công nghệ" bắt buộc (Coding Laws)

### 2.1. TypeScript Kỷ luật Thép

- **KHÔNG dùng `any`**: Hạn chế tối đa việc sử dụng kiểu `any`. Mọi payload API, response data, props của component đều phải được định nghĩa `interface` hoặc `type` rõ ràng (thường đặt trong file `types.ts`).
- Sử dụng Optional Chaining (`?.`) và Nullish Coalescing (`??`) để tránh lỗi undefined khi truy cập object.

### 2.2. Quy tắc Đặt tên (Naming Conventions)

- **Component & Page**: PascalCase (VD: `FilterHeader.tsx`, `PageContainer.tsx`, `Index.tsx`).
- **Hook**: camelCase, bắt đầu bằng chữ `use` (VD: `useData.ts`, `useAction.ts`, `useFilter.ts`).
- **Service/API**: camelCase (VD: `query.ts`, `api.ts`).
- **Hằng số (Constants)**: UPPER_SNAKE_CASE (VD: `LOCAL_STORAGE_KEYS`, `DANH_MUC_MA_SITC_ROUTE`).

### 2.3. Quy tắc Export

- **Components UI/Hooks**: Ưu tiên sử dụng **Named Export** (VD: `export const useData = ...`, `export const FilterHeader = ...`) để đảm bảo tính minh bạch khi import và dễ refactor.
- **Page/Route Component**: Sử dụng **Default Export** khi khai báo lazy route của Tanstack Router (VD: `export default function QuanLySITCPage()`).

### 2.4. Quy tắc Gọi API & Quản lý State

- **Tuyệt đối KHÔNG gọi axios trực tiếp trong UI Component**. Mọi API call phải được bọc trong các custom hook của `@tanstack/react-query` (`useQuery`, `useMutation`).
- Tách biệt rõ ràng **Server State** (dữ liệu từ API -> dùng React Query) và **Client State** (trạng thái mở modal, input value -> dùng `useState`, `useReducer`, hoặc Context).

### 2.5. Xử lý Lỗi & Thông báo (Error Handling)

- Lỗi API (500, 403, network) được handle global tại Axios Interceptors (`src/configs/axios.ts`) và hiển thị qua `notification` của Ant Design. Không throw error rác ra Component trừ khi cần custom fallback riêng.
