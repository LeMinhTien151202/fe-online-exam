# Kỹ năng lập trình React Frontend cho AI Agent

Dưới đây là Workflow (Quy trình chuẩn) từng bước mà Agent bắt buộc phải tuân theo khi được giao nhiệm vụ "Tạo một tính năng mới / Màn hình mới" trong dự án này. Không được nhảy cóc bước hay sáng tạo ra kiến trúc khác.

## Workflow Chuẩn: Phát triển một Màn hình CRUD (Create-Read-Update-Delete)

Giả sử nhiệm vụ là tạo màn hình "Quản lý Hàng hóa" (QuanLyHangHoa).

### ⏳ Bước 1: Định nghĩa Interface & Types (Data Model)
**Vị trí**: `src/apps/quan-ly-hang-hoa/services/types.ts`
- Phân tích yêu cầu/API schema.
- Tạo các Typescript `interface` cho Dữ liệu trả về (VD: `IHangHoa`), Payload Create (VD: `ICreateHangHoa`), Payload Update.

### ⏳ Bước 2: Khởi tạo Service API & React Query Hooks (Tầng Data Fetching)
**Vị trí**: `src/apps/quan-ly-hang-hoa/services/api.ts` và `query.ts`
- **api.ts**: Định nghĩa các hàm call API thuần bằng `axiosClient` (`getDanhSach`, `createItem`, `updateItem`, `deleteItem`).
- **query.ts**: Bọc các hàm API thành hooks của `@tanstack/react-query`:
  - `useDanhSachQuery`: dùng `useQuery` (nhớ xử lý params).
  - `useCreateMutation`, `useUpdateMutation`, `useDeleteMutation`: dùng `useMutation`.

### ⏳ Bước 3: Xây dựng các Controller Hooks (Tầng Logic Nghiệp vụ)
**Vị trí**: `src/apps/quan-ly-hang-hoa/hook/`
Chia nhỏ logic màn hình thành 4 hooks riêng biệt:
1. **`useFilter.ts`**: Quản lý State phân trang (`page`, `pageSize`) và bộ lọc (keyword, query). Return `filter` và `setFilter`.
2. **`useData.ts`**: Nhận `filter`, gọi `useDanhSachQuery` từ bước 2. Mapping data thô thành dữ liệu phù hợp hiển thị table (bổ sung số thứ tự, format ngày tháng). Return `data`, `total`, `isLoading`, `refetch`.
3. **`useAction.ts`**: Quản lý state đóng/mở Modals (`useState`). Trích xuất các hàm submit gọi `useMutation` (Thêm, sửa, xóa). Quản lý ID của record đang tương tác. Return state và các callback handlers.
4. **`useColumn.ts`**: Định nghĩa mảng `columns` của Ant Design Table. Bọc logic các nút Action (Sửa, Xóa) gọi tới các handler nhận từ `useAction`.

### ⏳ Bước 4: Xây dựng Dumb Components (Tầng Giao diện)
**Vị trí**: `src/apps/quan-ly-hang-hoa/components/`
Thiết kế các khối UI tĩnh:
1. **`FilterHeader.tsx`**: Thanh tìm kiếm, lọc, và nút Thêm mới. Nhận props `onSearch`, `onClickCreate`.
2. **`ThemMoiModal.tsx`**: Form thêm mới (dùng Antd `Form`). Quản lý state form bên trong, khi submit đẩy data qua prop `onSubmit(data)`.
3. **`CapNhatModal.tsx`**: Form cập nhật. Nhận prop `updateId`, bên trong gọi query lấy chi tiết theo ID đổ vào form. Submit qua prop `onSubmit`.

### ⏳ Bước 5: Lắp ráp Smart Component (Trái tim của Màn hình)
**Vị trí**: `src/apps/quan-ly-hang-hoa/pages/Index.tsx`
- Import layout cơ bản (`PageContainer`, `LayoutContent`).
- Khởi tạo các hooks: 
  ```ts
  const { filter, setFilter } = useFilter(initialFilter);
  const { data, total, isLoading, refetch } = useData(filter);
  const { openCreateModal, setOpenCreateModal, handleCreateSubmit, ... } = useAction(refetch);
  const { columns } = useColumn({ handleUpdate, handleDelete });
  ```
- Ráp nối UI Components bằng cách truyền các tham số tương ứng (Props Drilling).
- Tận dụng `TableWithPagination` hoặc `ConfirmDialog` từ `@shared/components`.

### ⏳ Bước 6: Khai báo Route & Phân quyền
**Vị trí**: `src/apps/quan-ly-hang-hoa/Route.tsx`
- Khai báo file route sử dụng `createLazyRoute` của `@tanstack/react-router`.
- Định nghĩa path trong `constants.ts`.
- Gắn node route mới này vào `routeTree` của hệ thống tại `src/Route.tsx`.

---
## Workflow Chuẩn: Styling Components (Kỷ luật UI)

### ⏳ Nguyên tắc Cốt lõi
1. **KHÔNG SỬ DỤNG INLINE CSS**: Tuyệt đối không viết CSS trực tiếp vào thuộc tính `style={{...}}` của thẻ HTML/React Component. (Ví dụ cấm: `<div style={{ margin: '10px' }}>`).
2. **Sử dụng styled-components**: Mọi CSS tùy chỉnh phải được định nghĩa thông qua `styled-components` và đặt trong một file riêng biệt có đuôi `*.styled.ts` nằm cùng cấp với component.
3. **Import chuẩn mực**: Tại component chính (VD: `Index.tsx`), import styled components theo cú pháp: `import * as S from './styled';` và sử dụng dưới dạng `<S.Wrapper>`, `<S.Title>`.
4. **Tailwind CSS**: Nếu chỉ là các tiện ích cơ bản (margin, padding, flex), ưu tiên sử dụng Utility Classes của Tailwind (`className="flex items-center gap-2"`) để tránh tạo ra quá nhiều styled components thừa thãi.

---
**LƯU Ý QUAN TRỌNG CHO AI:** TUYỆT ĐỐI KHÔNG gộp chung logic API, state quản lý Modal và định nghĩa Table Column vào cùng một file `Index.tsx`. Bắt buộc phải chia tách thành hệ thống custom hooks như Bước 3. LUÔN tách biệt HTML và logic CSS ra file riêng của nó, KHÔNG gộp chung (KHÔNG dùng inline styles). Đây là Đạo luật tối thượng của dự án!
