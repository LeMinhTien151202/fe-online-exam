# React Exam Online — Documentation Index

Bộ tài liệu frontend chỉ giữ các hợp đồng và luồng còn được code hiện hành sử dụng. Tài liệu backend, database, triển khai và luồng server lấy từ `D:\be-exam-online\java-exam-online\.docs`.

## Tài liệu nguồn chuẩn

| Tài liệu | Nội dung |
| --- | --- |
| [FE_ARCHITECTURE_FLOW.md](FE_ARCHITECTURE_FLOW.md) | Kiến trúc module, routing, React Query, axios và luồng nộp bài |
| [STYLEGUIDE.md](STYLEGUIDE.md) | Quy ước component và giao diện |
| [FE_AUTH_GUIDE.md](FE_AUTH_GUIDE.md) | Đăng nhập, refresh token, Google OAuth và phân quyền |
| [FE_MEDIA_UPLOAD_FLOW.md](FE_MEDIA_UPLOAD_FLOW.md) | Upload ảnh, audio và cách gắn media vào câu hỏi |
| [FE_PROGRESS.md](FE_PROGRESS.md) | Tiến độ theo đề, theo kỹ năng và learning streak |
| [FE_ADMIN_DASHBOARD.md](FE_ADMIN_DASHBOARD.md) | Contract và mapping dữ liệu dashboard |
| [QUESTION_SAMPLES.md](QUESTION_SAMPLES.md) | Payload câu hỏi của năm kỹ năng |
| [EXAM_SUBMIT_SAMPLES.md](EXAM_SUBMIT_SAMPLES.md) | Shape đáp án và response nộp bài |
| [SCORING_CEFR_PLAN.md](SCORING_CEFR_PLAN.md) | Quy đổi điểm/CEFR và contract hiển thị kết quả |

## Quy tắc cập nhật

- Không tạo lại tài liệu theo từng phase hoặc sổ lịch sử hoàn thành; lịch sử thay đổi thuộc Git.
- Không sao chép tài liệu backend sang repo frontend. Khi contract đổi, cập nhật tài liệu Java nguồn chuẩn và phần mapping FE có liên quan.
- Tài liệu phải mô tả code đang chạy, không giữ phương án tạm hoặc endpoint legacy.
