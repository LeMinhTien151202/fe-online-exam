import styled from "styled-components";

export const SidebarContainer = styled.aside<{ $collapsed?: boolean }>`
  width: ${(props) => (props.$collapsed ? "5.5rem" : "18rem")};
  /* Khớp với header trang làm bài (#0D2245), gradient tối nhẹ xuống đáy cho có chiều sâu */
  background: linear-gradient(180deg, #0d2245 0%, #0a1a37 100%);
  backdrop-filter: blur(20px);
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  /* Border phải + bóng nhẹ để tách khỏi vùng nội dung sáng */
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 4px 0 24px rgba(15, 23, 42, 0.06);
  z-index: 100;
  /* Đồng bộ tốc độ thu gọn với sidebar admin */
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  font-family: "Outfit", "Inter", system-ui, sans-serif;

  @media (max-width: 1024px) {
    display: none;
  }

  .collapse-btn {
    position: absolute;
    right: -14px;
    top: 2rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #24487a;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 110;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

    &:hover {
      background: #3b82f6;
      transform: scale(1.1);
      border-color: #60a5fa;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

export const LogoWrapper = styled.div<{ $collapsed?: boolean }>`
  padding: 2.25rem ${(props) => (props.$collapsed ? "1rem" : "1.75rem")};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  position: relative;
  flex-shrink: 0;

  img {
    height: 2.25rem;
    width: 2.25rem;
    object-fit: contain;
    background: #ffffff;
    padding: 2px;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    flex-shrink: 0;
  }

  span {
    font-size: 1.35rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: white;
    background: linear-gradient(to bottom, #ffffff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    height: 0.0625rem;
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
    /* Mục con: text thẳng hàng với label mục cha (giống admin) */
    return props.$isSub ? "0.5rem 0.75rem 0.5rem 3rem" : "0.75rem 1rem";
  }};
  margin: ${(props) => (props.$isSub ? "0.125rem 0" : "0")};
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};
  /* Bo góc 8px đồng bộ với menu admin */
  border-radius: 0.5rem;
  color: ${(props) => {
    if (props.$active) return "white";
    if (props.$isSub) return "rgba(255, 255, 255, 0.5)";
    return "rgba(255, 255, 255, 0.7)";
  }};
  background: ${(props) =>
    props.$active && !(props.$isOpen && !props.$isSub)
      ? "rgba(255, 255, 255, 0.12)"
      : "transparent"};
  font-size: ${(props) => (props.$isSub ? "0.8125rem" : "0.875rem")};
  font-weight: 500;
  /* Chỉ transition thuộc tính cần thiết để tránh giật khi thu gọn (đồng bộ với admin) */
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.1s ease,
    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1), gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: ${(props) =>
      props.$active && !(props.$isOpen && !props.$isSub)
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(255, 255, 255, 0.06)"};
    color: white;
  }

  &:active {
    transform: scale(0.98);
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
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: ${(props) => (props.$collapsed ? "none" : "block")};
  }
`;

export const SubMenuWrapper = styled.div<{
  $isOpen: boolean;
  $collapsed?: boolean;
}>`
  /* Panel lõm nền tối bọc mục con — giống .ant-menu-sub bên admin */
  background: rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  margin-top: ${(props) => (props.$isOpen && !props.$collapsed ? "0.25rem" : "0")};
  padding: ${(props) => (props.$isOpen && !props.$collapsed ? "0.25rem 0.375rem" : "0 0.375rem")};
  /* max-height sát nội dung thật (2-3 mục) để đóng/mở không bị trễ */
  max-height: ${(props) => (props.$isOpen && !props.$collapsed ? "9rem" : "0")};
  opacity: ${(props) => (props.$isOpen && !props.$collapsed ? "1" : "0")};
  transform: translateY(${(props) => (props.$isOpen && !props.$collapsed ? "0" : "-0.25rem")});
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  & + div .arrow-icon {
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
  }
`;

/* Nổi bật "Thi thử" bằng dải xanh chủ đạo thay cho viền vàng cũ */
export const ProLink = styled(NavLink)`
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.18), rgba(59, 130, 246, 0.04));
  color: #e2e8f0;

  span.material-symbols-outlined {
    color: #60a5fa;
  }

  &:hover {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.28), rgba(59, 130, 246, 0.08));
    color: white;
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

export const UserProfileWrapper = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 0.0625rem solid rgba(255, 255, 255, 0.06);
  position: relative;
`;

export const UserProfileCard = styled.div<{
  $collapsed?: boolean;
  $isActive?: boolean;
}>`
  background: ${(props) => (props.$isActive ? "#24487a" : "transparent")};
  padding: 0.625rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.18s ease, transform 0.1s ease;
  justify-content: ${(props) => (props.$collapsed ? "center" : "flex-start")};

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    .avatar {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  .avatar-container {
    position: relative;
    flex-shrink: 0;
  }

  .avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: white;
    font-size: 1rem;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  .user-info {
    flex: 1;
    display: ${(props) => (props.$collapsed ? "none" : "block")};
    min-width: 0;

    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .plan {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 0.125rem;
    }
  }

  .notif-wrapper {
    display: ${(props) => (props.$collapsed ? "none" : "block")};
    position: relative;
    padding: 0.25rem;
    color: rgba(255, 255, 255, 0.4);
    transition: color 0.2s;

    &:hover {
      color: white;
    }
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -0.125rem;
  right: -0.125rem;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.3125rem;
  border-radius: 6.25rem;
  border: 0.125rem solid #0d2245;
  min-width: 1rem;
  text-align: center;
  animation: pulse-ring 2s infinite;

  @keyframes pulse-ring {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 0.3125rem rgba(239, 68, 68, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
`;

export const CollapsedBadge = styled(NotificationBadge)`
  top: -0.25rem;
  right: -0.25rem;
  border-width: 0.125rem;
`;

export const DropdownMenu = styled.div<{
  $isOpen: boolean;
  $collapsed?: boolean;
}>`
  position: absolute;
  bottom: 100%;
  left: 0.75rem;
  right: 0.75rem;
  background: #24487a;
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 -0.625rem 1.5625rem rgba(0, 0, 0, 0.3);
  z-index: 200;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  transform-origin: bottom center;
  animation: dropdown-fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 0.0625rem solid rgba(255, 255, 255, 0.08);

  @keyframes dropdown-fade-in {
    from {
      opacity: 0;
      transform: translateY(0.5rem) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: ${(props) => (props.$collapsed ? "50%" : "2.5rem")};
    margin-left: -0.375rem;
    border: 0.375rem solid transparent;
    border-top-color: #24487a;
  }
`;

export const MenuItem = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => (props.$danger ? "#f87171" : "rgba(255, 255, 255, 0.7)")};
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.1s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: ${(props) => (props.$danger ? "#ef4444" : "white")};
  }

  &:active {
    transform: scale(0.98);
  }

  span.material-symbols-outlined {
    font-size: 1.125rem;
  }
`;

export const MenuDivider = styled.div`
  height: 0.0625rem;
  background: rgba(255, 255, 255, 0.06);
  margin: 0.5rem 0;
`;
export const NotificationPopover = styled.div<{
  $isOpen: boolean;
  $collapsed?: boolean;
}>`
  position: absolute;
  left: 100%;
  bottom: 1rem;
  margin-left: 0.5rem;
  width: 22.5rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 0.625rem 2.5rem rgba(0, 0, 0, 0.08); /* Softer, more diffused shadow */
  z-index: 250;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  overflow: hidden;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  animation: popover-fly-out 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left bottom;

  @keyframes popover-fly-out {
    from {
      opacity: 0;
      transform: translateX(-0.5rem) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  &::after {
    content: "";
    position: absolute;
    left: -0.5rem;
    bottom: 1.25rem;
    border: 0.25rem solid transparent;
    border-right-color: #ffffff;
    filter: drop-shadow(-1px 0 1px rgba(0, 0, 0, 0.02));
  }
`;

export const PopoverHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.05);
  background: #fdfdfe;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f172a; /* Deep navy */
    margin: 0;
    letter-spacing: -0.0125em;
  }

  .mark-read-btn {
    background: transparent;
    border: none;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #3b82f6;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s;

    &:hover {
      background: rgba(59, 130, 246, 0.05);
      color: #2563eb;
    }
  }
`;

export const PopoverBody = styled.div`
  max-height: 18rem;
  overflow-y: auto;
  padding: 0.25rem 0;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 0.25rem;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 0.625rem;
  }
`;

export const NotificationEntry = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  gap: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.02);

  &:hover {
    background: #f8fafc; /* Soft gray hover */
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const IconBox = styled.div<{ $type: string }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background: ${(props) => {
    switch (props.$type) {
      case "mock-test":
        return "rgba(59, 130, 246, 0.1)";
      case "question":
        return "rgba(20, 184, 166, 0.1)";
      case "streak":
        return "rgba(244, 63, 94, 0.1)";
      case "progress":
        return "rgba(34, 197, 94, 0.1)";
      default:
        return "rgba(0, 0, 0, 0.05)";
    }
  }};

  color: ${(props) => {
    switch (props.$type) {
      case "mock-test":
        return "#3b82f6";
      case "question":
        return "#14b8a6";
      case "streak":
        return "#f43f5e";
      case "progress":
        return "#22c55e";
      default:
        return "#64748b";
    }
  }};

  span {
    font-size: 1.25rem;
  }
`;

export const TimeGroupTitle = styled.div`
  padding: 0.75rem 1.25rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  background: #fdfdfe;
`;

export const PopoverFooter = styled.div`
  padding: 0.875rem;
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.05);
  text-align: center;
  background: #fdfdfe;

  button {
    background: transparent;
    border: none;
    font-size: 0.875rem;
    font-weight: 700;
    color: #0f172a;
    cursor: pointer;
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;

    &:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }
  }
`;

export const EntryContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .message {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #334155;
    font-weight: 500;
  }

  .time {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.125rem;
  }
`;
export const LoginCTAWrapper = styled.div<{ $collapsed?: boolean }>`
  background: #24487a; /* Surface nổi, sáng hơn nền base #1a365d */
  border: 0.0625rem solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: ${(props) => (props.$collapsed ? "0.75rem 0.5rem" : "1.25rem")};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${(props) =>
      props.$collapsed ? "none" : "translateY(-0.125rem)"};
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.25rem;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    opacity: 0.8;
  }
`;

export const LoginCTATitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.01em;
`;

export const LoginCTADesc = styled.p`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0;
  font-weight: 400;
`;

export const CTAButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const PrimaryCTAButton = styled.button`
  width: 100%;
  padding: 0.625rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0.125rem 0.5rem rgba(59, 130, 246, 0.3);

  &:hover {
    background: #2563eb;
    box-shadow: 0 0.25rem 0.75rem rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const SecondaryCTAButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 0.0625rem solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

export const CollapsedLoginBtn = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: #24487a;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
  border: 0.0625rem solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: #3b82f6;
    color: white;
    transform: scale(1.05);
  }
`;
