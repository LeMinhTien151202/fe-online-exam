import styled from "styled-components";

export const SidebarContainer = styled.aside<{ $collapsed?: boolean }>`
  width: ${(props) => (props.$collapsed ? "5.5rem" : "17.5rem")};
  background: #0f1d36;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible; /* Ensure absolute child toggle button is not clipped */

  @media (max-width: 1024px) {
    display: none;
  }

  .collapse-btn {
    position: absolute;
    right: -14px;
    top: 2rem; /* Move it slightly down from the top edge */
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #0f1d36;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 110;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;

    &:hover {
      background: #244b80; /* Nice primary brand hover color */
      border-color: #244b80;
    }
  }
`;

export const LogoWrapper = styled.div<{ $collapsed?: boolean }>`
  padding: 1.5rem ${(props) => (props.$collapsed ? "1rem" : "1.5rem")};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #0f1d36;
  transition: all 0.3s;
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  position: relative;
  flex-shrink: 0;

  img {
    height: 2rem;
    width: 2rem;
    object-fit: contain;
    background: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }

  span {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: white;
    opacity: ${(props) => (props.$collapsed ? "0" : "1")};
    display: ${(props) => (props.$collapsed ? "none" : "block")};
    white-space: nowrap;
  }
`;

export const NavContainer = styled.nav`
  flex: 1;
  overflow-y: auto;
  margin-top: 0.5rem;
  flex-shrink: 1;
  min-height: 0;

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const NavSection = styled.div`
  padding: 0 0.75rem;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h3<{ $collapsed?: boolean }>`
  padding: 0 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 700;
  text-align: ${(props) => (props.$collapsed ? "center" : "left")};

  .text {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
  }
  .line {
    display: ${(props) => (props.$collapsed ? "block" : "none")};
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0.5rem auto;
    width: 2rem;
  }
`;

export const NavItemWrapper = styled.div`
  margin-bottom: 0.25rem;
`;

export const NavLink = styled.a<{
  $active?: boolean;
  $isSub?: boolean;
  $collapsed?: boolean;
  $isOpen?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? "0" : "0.75rem")};
  padding: ${(props) => {
    if (props.$collapsed) return "0.75rem 0";
    return props.$isSub ? "0.5rem 1rem 0.5rem 3.25rem" : "0.75rem 1rem";
  }};
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  border-radius: 0.75rem;
  color: ${(props) => {
    if (props.$active) return "white";
    if (props.$isSub) return "rgba(255, 255, 255, 0.5)";
    return "rgba(255, 255, 255, 0.7)";
  }};
  background: ${(props) =>
    props.$active && !(props.$isOpen && !props.$isSub)
      ? "rgba(255, 255, 255, 0.1)"
      : "transparent"};
  font-size: ${(props) => (props.$isSub ? "0.8125rem" : "0.875rem")};
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  span.material-symbols-outlined {
    font-size: 1.5rem;
    width: 1.5rem;
    flex-shrink: 0;
    text-align: center;
  }

  .nav-text {
    display: ${(props) => (props.$collapsed ? "none" : "block")};
  }

  .arrow-icon {
    margin-left: auto;
    font-size: 0.625rem;
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: ${(props) => (props.$collapsed ? "none" : "block")};
  }
`;

export const SubMenuWrapper = styled.div<{
  $isOpen: boolean;
  $collapsed?: boolean;
}>`
  max-height: ${(props) =>
    props.$isOpen && !props.$collapsed ? "18.75rem" : "0"};
  opacity: ${(props) => (props.$isOpen && !props.$collapsed ? "1" : "0")};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  & + div .arrow-icon {
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
  }
`;

export const ProLink = styled(NavLink)`
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.1);
  color: #fbbf24;

  &:hover {
    background: rgba(251, 191, 36, 0.1);
  }

  .ant-badge {
    display: ${(props) => (props.$collapsed ? "none" : "block")};
  }
`;

export const OnlineBadge = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  gap: ${(props) => (props.$collapsed ? "0" : "0.5rem")};
  background: rgba(255, 255, 255, 0.05);
  padding: ${(props) => (props.$collapsed ? "0.75rem 0" : "0.5rem 1rem")};
  border-radius: ${(props) => (props.$collapsed ? "0.75rem" : "6.25rem")};
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 1rem 1rem;
  white-space: nowrap;
  flex-shrink: 0;

  .dot {
    width: 0.375rem;
    height: 0.375rem;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px #22c55e;
    flex-shrink: 0;
  }

  .badge-text {
    display: ${(props) => (props.$collapsed ? "none" : "block")};
  }
`;

export const UserProfileCard = styled.div<{ $collapsed?: boolean }>`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  gap: 0.75rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;

  .avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: #60a5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    display: ${(props) => (props.$collapsed ? "none" : "block")};

    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.125rem;
      white-space: nowrap;
    }
    .plan {
      font-size: 0.6875rem;
      color: #94a3b8;
      white-space: nowrap;
    }
  }

  .notification-btn {
    position: relative;
    color: rgba(255, 255, 255, 0.6);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    display: ${(props) => (props.$collapsed ? "none" : "flex")};

    &:hover {
      color: white;
    }

    .dot {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      width: 0.375rem;
      height: 0.375rem;
      background: #ef4444;
      border-radius: 50%;
      border: 1px solid #0f1d36;
    }
  }
`;
