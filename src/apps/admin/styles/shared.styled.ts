import styled from "styled-components";
import { Button } from "antd";
import { ADMIN_COLORS } from "../constants";

export const AdminContainer = styled.div`
  padding: 2.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: "Outfit", sans-serif;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: ${ADMIN_COLORS.primary};
    margin: 0;
    letter-spacing: -0.025em;
  }

  p {
    color: #64748b;
    margin: 0.5rem 0 0 0;
    font-size: 1rem;
  }
`;

export const PrimaryButton = styled(Button)`
  height: 42px;
  padding: 0 1.5rem;
  border-radius: 8px;
  background-color: ${ADMIN_COLORS.primary} !important;
  border-color: ${ADMIN_COLORS.primary} !important;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: #2d3748 !important;
    transform: translateY(-1px);
  }
`;

export const TableWrapper = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  .ant-table-tbody > tr > td {
    padding: 1rem 1.5rem;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const StatusBadge = styled.span<{
  $type?: "success" | "warning" | "error" | "info" | "neutral";
}>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  ${(props) => {
    switch (props.$type) {
      case "success":
        return `background-color: #dcfce7; color: #166534;`;
      case "warning":
        return `background-color: #fef9c3; color: #854d0e;`;
      case "error":
        return `background-color: #fee2e2; color: #991b1b;`;
      case "info":
        return `background-color: #e0f2fe; color: #075985;`;
      default:
        return `background-color: #f1f5f9; color: #475569;`;
    }
  }}
`;
