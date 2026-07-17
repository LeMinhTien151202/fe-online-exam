import styled from "styled-components";
import { Layout, Menu } from "antd";
import { ADMIN_COLORS } from "../constants";

const { Sider, Header, Content } = Layout;

export const StyledLayout = styled(Layout)`
  min-height: 100dvh;
  background: ${ADMIN_COLORS.contentBg};
`;

export const StyledSider = styled(Sider)`
  background: ${ADMIN_COLORS.sidebarBg} !important;
  border-right: 1px solid ${ADMIN_COLORS.border};
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100dvh;
  z-index: 1001;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  /* Đồng bộ tốc độ thu gọn với sidebar học viên */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ant-layout-sider-trigger {
    background: #111827 !important;
    border-top: 1px solid #1f2937;
  }
`;

export const LogoWrapper = styled.div<{ $collapsed: boolean }>`
  height: 64px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    flex-shrink: 0;
  }

  span {
    color: #ffffff;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    opacity: ${(props) => (props.$collapsed ? 0 : 1)};
    transition: opacity 0.2s;
  }
`;

export const MenuWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;

  /* Custom scrollbar for menu */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

export const StyledMenu = styled(Menu)`
  background: transparent !important;
  border: none !important;

  .ant-menu-item-group-title {
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 0.6875rem !important;
    font-weight: 700 !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.75rem 1.25rem 0.25rem !important;
  }

  .ant-menu-item,
  .ant-menu-submenu-title {
    color: rgba(255, 255, 255, 0.7) !important;
    font-weight: 500;
    margin: 4px 12px !important;
    width: calc(100% - 24px) !important;
    border-radius: 8px !important;
    height: 40px !important;
    line-height: 40px !important;
    display: flex;
    align-items: center;
    /* Đồng bộ hiệu ứng hover/nhấn với sidebar học viên */
    transition: background-color 0.18s ease, color 0.18s ease, transform 0.1s ease !important;

    .anticon {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7) !important;
      transition: color 0.18s ease !important;
    }

    &:active {
      transform: scale(0.98);
    }

    &:hover,
    &-active,
    &-selected {
      color: #ffffff !important;

      .anticon {
        color: #ffffff !important;
      }
    }
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover,
  .ant-menu-item-active,
  .ant-menu-submenu-active {
    background: rgba(255, 255, 255, 0.06) !important;
    color: #ffffff !important;
  }

  .ant-menu-item-selected {
    background: rgba(255, 255, 255, 0.12) !important;
    color: #ffffff !important;

    .anticon {
      color: #ffffff !important;
    }
  }

  .ant-menu-submenu-arrow {
    color: rgba(255, 255, 255, 0.7) !important;
    transition: color 0.2s ease !important;
  }

  .ant-menu-submenu-open > .ant-menu-submenu-title,
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #ffffff !important;

    .anticon,
    .ant-menu-submenu-arrow {
      color: #ffffff !important;
    }
  }

  .ant-menu-sub {
    background: rgba(0, 0, 0, 0.15) !important;
    border-radius: 8px;
    margin: 4px 12px !important;
    width: calc(100% - 24px) !important;
    padding: 4px 0 !important;

    .ant-menu-item {
      margin: 2px 8px !important;
      width: calc(100% - 16px) !important;
      height: 36px !important;
      line-height: 36px !important;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.5) !important;
      transition: background-color 0.18s ease, color 0.18s ease, transform 0.1s ease !important;

      &:active {
        transform: scale(0.98);
      }

      &:hover,
      &-active {
        background: rgba(255, 255, 255, 0.06) !important;
        color: #ffffff !important;
      }

      &.ant-menu-item-selected {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
      }
    }
  }
`;

export const UserCard = styled.div<{ $collapsed: boolean }>`
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
  white-space: nowrap;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${ADMIN_COLORS.primary};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info {
    display: flex;
    flex-direction: column;
    opacity: ${(props) => (props.$collapsed ? 0 : 1)};
    transition: opacity 0.2s;

    .name {
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .role {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
    }
  }
`;

export const StyledHeader = styled(Header)`
  background: ${ADMIN_COLORS.headerBg} !important;
  padding: 0 1.5rem !important;
  height: 64px !important;
  line-height: 64px !important;
  border-bottom: 1px solid ${ADMIN_COLORS.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StyledContent = styled(Content)`
  padding: 1.5rem;
  min-height: calc(100vh - 64px);
  background: ${ADMIN_COLORS.contentBg};
  overflow-y: auto;
`;

export const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: ${ADMIN_COLORS.textPrimary};
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;
