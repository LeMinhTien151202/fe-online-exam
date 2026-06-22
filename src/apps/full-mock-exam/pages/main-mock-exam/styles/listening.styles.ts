import styled from "styled-components";
import { Select, Button } from "antd";

export const StatementRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8fafc;

  .statement-number {
    font-weight: 700;
    color: #0f172a;
    font-size: 1.1rem;
  }

  .statement-text {
    flex: 1;
    color: #334155;
    font-size: 1.05rem;
    line-height: 1.5;
  }
`;

export const StyledSelect = styled(Select)<{ $hasValue?: boolean }>`
  width: 180px !important;

  .ant-select-selector {
    border-radius: 8px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;

    border-color: ${(props) =>
      props.$hasValue ? "#10b981" : "#e2e8f0"} !important;
    background: ${(props) =>
      props.$hasValue ? "#ecfdf5" : "#ffffff"} !important;
  }
`;

export const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
`;

export const PlayButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  border-radius: 6px;
  font-weight: 600;
`;

export const StatusText = styled.span`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;

  strong {
    color: #334155;
    font-weight: 700;
  }
`;

export const TranscriptButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

export const TranscriptBox = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  font-size: 1rem;
  line-height: 1.6;
`;
