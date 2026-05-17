# Kỷ luật UI & Component (UI & Component Styleguide)

## 1. Triết lý phân chia Component (Smart & Dumb Components)

Dự án áp dụng triệt để mô hình **Container / Presenter Pattern**, đảm bảo UI và Logic được tách biệt tối đa.

### 1.1. Smart Component (Container - Kẻ điều phối)
- Thường là file `pages/Index.tsx` tại từng màn hình.
- **Nhiệm vụ**: Điều phối toàn bộ dữ liệu. Giao tiếp với các custom hook (`useData`, `useAction`, `useColumn`, `useFilter`) để lấy data và logic xử lý (API call, Modal state).
- **Quy tắc UI**: Hạn chế tối đa viết thẻ HTML thô hoặc styled-components phức tạp ở đây. Chỉ chứa layout cơ bản (`PageContainer`, `LayoutContent`) và gọi các component con (Dumb components), truyền dữ liệu vào thông qua `props`.

### 1.2. Dumb Component (Presenter - Kẻ hiển thị)
- Nằm trong thư mục `components/` của domain hoặc `shared/components/`.
- Bao gồm: `FilterHeader.tsx`, `ThemMoiModal.tsx`, `TableWithPagination`...
- **Nhiệm vụ**: Chỉ quan tâm đến việc **Hiển thị giao diện** như thế nào. 
- **Quy tắc**:
  - KHÔNG call API trực tiếp.
  - KHÔNG chứa logic nghiệp vụ phức tạp.
  - Nhận Data và Callbacks (như `onClick`, `onSubmit`, `onCancel`) qua `props`.
  - Nếu cần Form, quản lý state cục bộ của form (ví dụ Antd `Form.useForm()`) và trả data đã chuẩn hóa ra ngoài qua callback `onSubmit(data)`.

## 2. Quy chuẩn Hệ thống Thiết kế (Design System)

### 2.1. UI Kit Cốt lõi (Ant Design)
- Ant Design (`antd`) là trái tim của giao diện. Mọi component chuẩn (Button, Input, Table, Modal, Select) đều phải dùng từ thư viện này.
- **Tái sử dụng chung**: Các component có tính chất lặp lại được wrap lại tại `src/shared/components`. Ví dụ: Thay vì dùng `<Table>` của antd trực tiếp ở mọi nơi, sử dụng `<TableWithPagination>` từ `@shared/components` để chuẩn hóa giao diện bảng và phân trang của toàn app.

### 2.2. CSS & Styling Strategy
Dự án là sự pha trộn của nhiều phương pháp styling, nhưng có quy tắc phân cấp ưu tiên:

1. **Utility-First (Tailwind CSS)**: 
   - Sử dụng cho spacing (margin, padding), flexbox/grid layout, typography cơ bản.
   - Giúp viết nhanh, không cần đặt tên class. Ví dụ: `className="flex items-center justify-between p-4"`.
2. **Styled-components**: 
   - Dùng khi cần customize sâu một Component của Ant Design mà Tailwind khó can thiệp.
   luôn tách biệt styled-components ra file riêng khong gộp chung với file giao diện
   - Thường đặt file `styled.ts` cạnh component hoặc dùng `global-styled`.
3. **Sass/SCSS**:
   - Quản lý các biến global, base styling và overriding toàn cục (Ví dụ: ghi đè màu sắc mặc định của Table antd, Button antd). Được tổ chức ở `src/assets/scss/`.

### 2.3. Typography & Colors (Variables)
- Hạn chế hardcode màu sắc kiểu `#ff0000`. Thay vào đó, sử dụng hệ thống biến CSS hoặc các class mặc định của Tailwind/Ant Design Theme.
- Cấu hình Theme của Antd được đặt tại `src/configs/antDesign.tsx` (quản lý `colorPrimary`, `fontFamily`, v.v.). Mọi override màu sắc đều ưu tiên thông qua ConfigProvider của Antd.
