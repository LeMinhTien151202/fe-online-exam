import { createGlobalStyle } from "styled-components";

export const GlobalAdminStyle = createGlobalStyle`
  /* Reset and Global Button Styles for Admin Portals (Modals, Selects, etc.) */
  .ant-btn-primary {
    height: 36px !important;
    padding: 4px 16px !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    box-shadow: none !important;
    transition: all 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    
    &:hover {
      opacity: 0.9 !important;
      background-color: inherit;
      border-color: inherit;
      box-shadow: none !important;
    }
    
    &:active {
      transform: scale(0.97);
    }
  }

  /* Target specific Modal buttons if needed */
  .ant-modal-footer .ant-btn-primary {
    box-shadow: none !important;
  }
`;
