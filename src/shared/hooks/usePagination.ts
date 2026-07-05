import { useState } from 'react';

// Quản lý page + pageSize cho danh sách phân trang.
// onChange khớp chữ ký của AppPagination: (page, pageSize).
// Đổi pageSize -> tự về trang 1.
export const usePagination = (initialSize = 10) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialSize);

  const onChange = (nextPage: number, nextSize: number) => {
    if (nextSize && nextSize !== pageSize) {
      setPageSize(nextSize);
      setPage(1);
    } else {
      setPage(nextPage);
    }
  };

  // Gọi khi đổi bộ lọc để quay về trang đầu
  const reset = () => setPage(1);

  return { page, pageSize, setPage, onChange, reset };
};
