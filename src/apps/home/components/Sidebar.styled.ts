import styled from 'styled-components';

export const SidebarContainer = styled.aside`
  width: 17.5rem;
  background: #001A41;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const LogoWrapper = styled.div`
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #001A41;

  img {
    height: 2rem;
    width: 2rem;
    object-fit: contain;
    background: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
  }

  span {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: white;
  }
`;

export const NavSection = styled.div`
  padding: 0 0.75rem;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h3`
  padding: 0 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 700;
`;

export const NavItemWrapper = styled.div`
  margin-bottom: 0.25rem;
`;

export const NavLink = styled.a<{ $active?: boolean; $isSub?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: ${props => props.$isSub ? '0.5rem 1rem 0.5rem 3.25rem' : '0.75rem 1rem'};
  border-radius: 0.75rem;
  color: ${props => {
    if (props.$active) return 'white';
    if (props.$isSub) return 'rgba(255, 255, 255, 0.5)';
    return 'rgba(255, 255, 255, 0.7)';
  }};
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  font-size: ${props => props.$isSub ? '0.8125rem' : '0.875rem'};
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  span.material-symbols-outlined {
    font-size: 1.5rem;
    width: 1.5rem;
    flex-shrink: 0;
  }

  .arrow-icon {
    margin-left: auto;
    font-size: 0.625rem;
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export const SubMenuWrapper = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '18.75rem' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  & + div .arrow-icon {
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

export const ProLink = styled(NavLink)`
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  
  &:hover {
    background: rgba(251, 191, 36, 0.1);
  }
`;

export const OnlineBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 6.25rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 1rem 1rem;

  .dot {
    width: 0.375rem;
    height: 0.375rem;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px #22c55e;
  }
`;

export const UserProfileCard = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

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
    .name {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.125rem;
    }
    .plan {
      font-size: 0.6875rem;
      color: #94a3b8;
    }
  }

  .notification-btn {
    position: relative;
    color: rgba(255, 255, 255, 0.6);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    
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
      border: 1px solid #001A41;
    }
  }
`;
