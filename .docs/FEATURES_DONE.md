_Mỗi khi hoàn thành task, phải dùng lệnh /save để cập nhật vắn tắt vào đây_

# Sổ tay tiến độ dự án (FEATURES_DONE)

## Phiên bản: 1.0.0 (Khởi tạo)

### 🚀 Giai đoạn 0: Khởi tạo hệ thống (Setup Base)

- [x] Phân tích toàn bộ Source Code hiện tại.
- [x] Thiết lập cấu trúc thư mục chuẩn Domain-Driven Design (DDD).
- [x] Tạo bộ khung hướng dẫn AI (.agent/ & .docs/).
- [x] Cấu hình Axios Interceptors & React Query Base.
- [x] Thiết lập Ant Design ConfigProvider & Theme.

### 📦 Các thành phần tái sử dụng (Reusable Assets)

#### Components

- `TableWithPagination`: Bảng dữ liệu tích hợp phân trang chuẩn Antd.
- `PageContainer`: Layout bọc trang tích hợp Breadcrumb.
- `ConfirmDialog`: Modal xác nhận hành động nguy hiểm.
- `RequiredLabel`: Nhãn đánh dấu trường bắt buộc trong Form.

#### Hooks

- `useFilter`: Quản lý state bộ lọc và phân trang.
- `useI18n`: Hook hỗ trợ đa ngôn ngữ nhanh.
- `usePageTitle`: Tự động cập nhật tiêu đề trang.

---

## Nhật ký cập nhật (Recent Logs)

- _2026-05-13_: Hoàn thành thiết lập bộ khung quản lý dự án cho AI Agent.
