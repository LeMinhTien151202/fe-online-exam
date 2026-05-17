Đóng vai là một System Architect và chuyên gia ReactJS/Frontend Engineer. Nhiệm vụ của bạn là phân tích toàn bộ source code của dự án React này để "chiết xuất" triết lý code, kiến trúc hệ thống và các quy chuẩn kỹ thuật. 

Tôi muốn đóng gói những tinh hoa của dự án này để sử dụng làm "Bộ nhớ vĩnh cửu" (Context) cho một dự án mới theo chuẩn Vibe Coding.

Hãy phân tích sâu source code hiện tại và tạo ra nội dung chi tiết cho 4 file Markdown sau đây. Hãy đảm bảo tính DRY (Don't Repeat Yourself) và quy định rõ ràng, nghiêm ngặt:

1. Tạo file `.agent/AGENTS.md` (Bản Hiến pháp của dự án):
- Tổng hợp Tech Stack chính được sử dụng (VD: React, Vite/Next.js, TypeScript, Tailwind/Antd/Styled-components...).
- Đúc kết các "Đạo luật công nghệ" bắt buộc (VD: Tuyệt đối không dùng kiểu `any` trong TypeScript, quy tắc đặt tên file/folder, quy tắc export default/named).

2. Tạo file `.docs/ARCHITECTURE.md` (Kiến trúc hệ thống Frontend):
- Mô tả lại sơ đồ tư duy về cấu trúc thư mục hiện tại (Quy hoạch thư mục `/components`, `/hooks`, `/services`, `/store`, `/utils`...).
- Trích xuất luồng xử lý dữ liệu (Data Flow): Cách dự án này quản lý State (Zustand, Redux, hay Context API?) và cách call API (Axios instance, React Query, interceptors...).

3. Tạo file `.docs/STYLEGUIDE.md` (Kỷ luật UI & Component):
- Phân tích triết lý chia Component hiện tại (Đâu là Smart Component chứa logic, đâu là Dumb Component chỉ render UI).
- Trích xuất bộ quy chuẩn về Design System: Cách tái sử dụng UI Kit hiện tại, các biến màu sắc (colors), typography, và quy tắc viết CSS/Tailwind/Styled-components.

4. Tạo file `.agent/skills/react-frontend-skill.md` (Kỹ năng lập trình cho AI Agent):
- Viết một quy trình từng bước (Workflow) chuẩn xác nhất dựa trên cách code của dự án này, để sau này khi tôi yêu cầu AI "Tạo một tính năng X", AI sẽ biết phải thực hiện theo thứ tự nào (VD: Bước 1: Tạo interface/type -> Bước 2: Viết service call API -> Bước 3: Tạo UI Component -> Bước 4: Viết logic xử lý state -> Bước 5: Ghép vào Page).

YÊU CẦU:
- Không bịa thêm kiến trúc bên ngoài, chỉ trích xuất chính xác từ những gì đang có trong source code này.
- Trình bày dạng Markdown chuyên nghiệp, cấu trúc rõ ràng, sử dụng code block minh họa nếu cần.
- Output tách biệt rõ ràng nội dung của từng file để tôi dễ dàng copy sang dự án mới.