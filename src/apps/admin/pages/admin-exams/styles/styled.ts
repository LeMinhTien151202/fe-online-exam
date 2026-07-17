import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// ---------- Bước 3: Xem trước & Xuất bản ----------

export const PreviewSticky = styled.div`
  position: sticky;
  top: 16px;
`;

export const PreviewExamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
`;

export const PreviewQuestion = styled.div`
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const PreviewAnswerBox = styled.div`
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 8px;
`;

export const PreviewSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
`;

// Thanh Nháp/Công khai cuối trang sửa đề
export const PublishBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;
