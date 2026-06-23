import styled from "styled-components";
import { ADMIN_COLORS } from "../../../constants";

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  div {
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    p {
      color: #64748b;
      font-size: 0.95rem;
    }
  }
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .ant-table-thead > tr > th {
    background: #f8fafc;
    font-weight: 700;
    color: #475569;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${(props) =>
    props.$status === "active" ? "#ecfdf5" : "#fef2f2"};
  color: ${(props) => (props.$status === "active" ? "#10b981" : "#ef4444")};
`;

export const ActionButton = styled.button`
  background: ${ADMIN_COLORS.primary};
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: ${ADMIN_COLORS.primaryHover};
    transform: translateY(-1px);
  }
`;
