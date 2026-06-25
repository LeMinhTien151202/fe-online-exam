import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Global Rules for Question Module */
  .premium-card {
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.05),
      0 2px 4px -2px rgb(0 0 0 / 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      border-color: #e2e8f0;
    }

    .ant-card-head {
      border-bottom: 1px solid #f1f5f9;
      background: #fafafa;
      border-radius: 16px 16px 0 0;
    }
  }

  .premium-card-light {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
  }

  .ant-btn-primary {
    box-shadow: none !important;
    transition: all 0.2s ease !important;

    &:hover {
      opacity: 0.9 !important;
      background-color: inherit; /* Keep branding color */
      box-shadow: none !important;
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const TextEllipsis = styled.div`
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FlexAlign = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
