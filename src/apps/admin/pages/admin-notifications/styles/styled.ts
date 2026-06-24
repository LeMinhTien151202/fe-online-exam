import styled from "styled-components";
import { Card } from "antd";
import { ADMIN_COLORS } from "../../../constants";

export const Container = styled.div`
  padding: 1.5rem;
  background-color: #ffffff;
  min-height: calc(100vh - 64px);
`;

export const NotificationCard = styled(Card)`
  border-radius: 0;
  border: none;
  background: transparent;

  .ant-card-body {
    padding: 0;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
`;

export const TypeBadge = styled.span<{ $type: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  ${(props) => {
    switch (props.$type) {
      case "system":
        return "background: #fee2e2; color: #991b1b;";
      case "exam":
        return "background: #e0f2fe; color: #075985;";
      case "question":
        return "background: #f0fdf4; color: #166534;";
      case "promotion":
        return "background: #fef9c3; color: #854d0e;";
      default:
        return "background: #f1f5f9; color: #475569;";
    }
  }}
`;

export const StatusIndicator = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => {
      switch (props.$status) {
        case "published":
          return "#10b981";
        case "draft":
          return "#94a3b8";
        case "scheduled":
          return "#f59e0b";
        default:
          return "#cbd5e1";
      }
    }};
  }
`;
