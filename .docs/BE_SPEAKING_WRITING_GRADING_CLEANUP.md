# Contract chấm Writing/Speaking và dọn media

## Luồng hiện hành

- Writing và Speaking chỉ được chấm bằng AI; không có hàng đợi hoặc UI xử lý thủ công.
- Câu bỏ trống trả 0/A0 mà không gọi provider.
- Với câu đã trả lời, lỗi Gemini, timeout, quota, media hoặc JSON sai schema làm toàn bộ submit thất bại.
- Khi thất bại, backend không ghi attempt, điểm hay tiến độ. FE giữ trạng thái bài làm và cho phép nộp lại.
- Response 2xx luôn là kết quả AI hoàn chỉnh và không có cờ trạng thái chờ xử lý.

## Audio Speaking

1. FE phải có quyền micrô và bản ghi thật; nếu bị từ chối quyền thì dừng tại màn ghi âm, báo cách cấp quyền và không tạo dữ liệu giả.
2. FE upload audio qua `POST /files/student-answer` rồi nộp URL cho câu RECORD.
3. Backend kiểm tra URL thuộc storage tin cậy, MIME, magic byte và dung lượng trước khi gọi AI/STT.
4. Sau khi chấm và persist thành công, audio tạm của PART_PRACTICE/SKILL_FULL_SET được xóa best-effort. MOCK_TEST giữ file để review attempt.
5. Nếu chấm lỗi, cleanup sau thành công không chạy nên audio còn nguyên cho lần nộp lại.

## Contract FE

```ts
type AiGradeDetail = {
  questionId: number;
  questionType: 'ESSAY' | 'RECORD';
  aiScore: number;
  band: string;
  feedback: string;
  criteria?: Array<{ name: string; score: number | null; comment: string }>;
};
```

FE không hiển thị nhãn chờ xử lý. Lỗi submit dùng thông báo chung từ Axios interceptor và nút nộp vẫn có thể dùng lại.
