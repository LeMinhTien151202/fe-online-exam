# Master Memory for AI Agent (CLAUDE.md)

## 🧠 Chỉ thị hệ thống tối cao (System Instructions)

1. **Tiền kiểm tra (Pre-coding)**: Bắt buộc đọc hiểu `.docs/STYLEGUIDE.md` và `.docs/ARCHITECTURE.md` trước khi thực hiện bất kỳ thay đổi mã nguồn nào.
2. **Kỷ luật giao tiếp**: Trả lời ngắn gọn, tập trung vào giải pháp kỹ thuật. Không giải thích dông dài trừ khi được yêu cầu.
3. **Quy trình hoàn thiện**: Sau khi hoàn thành một Task hoặc Tính năng, AI phải:
   - Tự động nhắc nhở người dùng cập nhật hoặc tự cập nhật vắn tắt vào `.docs/FEATURES_DONE.md`.
   - Nhắc người dùng xóa nội dung trong `.docs/IDEA.md` nếu nhiệm vụ đã xong.
4. **Kiến trúc bắt buộc**: Tuân thủ nghiêm ngặt mô hình chia tách Hook (useData, useAction, useColumn) và Smart/Dumb Component như đã định nghĩa trong `.agent/skills/react-frontend-skill.md`.

## 🛠 Lệnh Terminal cơ bản

- **Chạy môi trường Dev**: `yarn dev` hoặc `npm run dev`
- **Build dự án**: `yarn build` hoặc `npm run build`
- **Lint code**: `yarn lint` hoặc `npm run lint`
- **Xem trước bản Build**: `yarn preview` hoặc `npm run preview`

## 🎨 Quy chuẩn UI/UX

- Luôn ưu tiên Ant Design components.
- Sử dụng Styled-components cho custom logic.
- Đảm bảo tính responsive và hỗ trợ đa ngôn ngữ qua `i18n`.
