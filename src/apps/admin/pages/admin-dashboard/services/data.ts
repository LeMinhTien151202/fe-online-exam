export const activityData = [
  {
    name: "Ngày 1",
    Grammar: 400,
    Reading: 240,
    Listening: 320,
    Speaking: 120,
    Writing: 180,
  },
  {
    name: "Ngày 5",
    Grammar: 500,
    Reading: 300,
    Listening: 350,
    Speaking: 150,
    Writing: 210,
  },
  {
    name: "Ngày 10",
    Grammar: 450,
    Reading: 400,
    Listening: 300,
    Speaking: 220,
    Writing: 250,
  },
  {
    name: "Ngày 15",
    Grammar: 600,
    Reading: 350,
    Listening: 410,
    Speaking: 280,
    Writing: 270,
  },
  {
    name: "Ngày 20",
    Grammar: 720,
    Reading: 450,
    Listening: 480,
    Speaking: 310,
    Writing: 300,
  },
  {
    name: "Ngày 25",
    Grammar: 800,
    Reading: 520,
    Listening: 550,
    Speaking: 390,
    Writing: 350,
  },
  {
    name: "Ngày 30",
    Grammar: 950,
    Reading: 600,
    Listening: 620,
    Speaking: 450,
    Writing: 410,
  },
];

export const skillDistribution = [
  { name: "Grammar", value: 35, color: "#1a365d" },
  { name: "Reading", value: 25, color: "#0ea5e9" },
  { name: "Listening", value: 20, color: "#8b5cf6" },
  { name: "Speaking", value: 10, color: "#f97316" },
  { name: "Writing", value: 10, color: "#16a34a" },
];

export const recentStudents = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    email: "nva@gmail.com",
    date: "03/06/2026",
    status: "Active",
  },
  {
    key: "2",
    name: "Trần Thị B",
    email: "ttb@gmail.com",
    date: "02/06/2026",
    status: "Active",
  },
  {
    key: "3",
    name: "Lê Hoàng C",
    email: "lhc@gmail.com",
    date: "02/06/2026",
    status: "Active",
  },
  {
    key: "4",
    name: "Phạm Minh D",
    email: "pmd@gmail.com",
    date: "01/06/2026",
    status: "Inactive",
  },
  {
    key: "5",
    name: "Hoàng Văn E",
    email: "hve@gmail.com",
    date: "01/06/2026",
    status: "Active",
  },
];

export const recentTests = [
  {
    key: "1",
    student: "Nguyễn Văn A",
    skill: "Reading",
    score: "45/50",
    time: "25:12",
  },
  {
    key: "2",
    student: "Lê Hoàng C",
    skill: "Listening",
    score: "38/50",
    time: "34:45",
  },
  {
    key: "3",
    student: "Trần Thị B",
    skill: "Writing",
    score: "Chờ chấm",
    time: "48:20",
  },
  {
    key: "4",
    student: "Nguyễn Văn A",
    skill: "Speaking",
    score: "Chờ chấm",
    time: "11:15",
  },
  {
    key: "5",
    student: "Hoàng Văn E",
    skill: "Grammar",
    score: "42/50",
    time: "18:30",
  },
];

export const timelineEvents = [
  {
    color: "green",
    children:
      "Học viên Nguyễn Văn A đã hoàn thành bài thi thử Aptis Full Test #3 (10 phút trước)",
  },
  {
    color: "blue",
    children: "Đã thêm 50 câu hỏi Ngữ pháp mới vào ngân hàng câu hỏi (45 phút trước)",
  },
  {
    color: "cyan",
    children: 'Tạo bộ đề mới "Luyện Listening P1 - Đề 02" (1 giờ trước)',
  },
  {
    color: "orange",
    children: 'Gửi thông báo "Bảo trì hệ thống" tới toàn bộ học viên (2 giờ trước)',
  },
  {
    color: "green",
    children:
      "Học viên Hoàng Văn E đạt chuỗi ngày học tập 15 ngày (4 giờ trước)",
  },
];

export const questionStats = {
  total: 1250,
  skills: [
    { name: "Ngữ pháp & Từ vựng", count: 320 },
    { name: "Nghe", count: 280 },
    { name: "Đọc", count: 300 },
    { name: "Nói", count: 180 },
    { name: "Viết", count: 170 },
  ],
};

export const examCounts = {
  total: 45,
  types: [
    { name: "Theo phần", count: 20 },
    { name: "Theo bộ đề", count: 15 },
    { name: "Đề thi thử", count: 10 },
  ],
};
