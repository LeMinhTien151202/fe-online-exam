import styled from "styled-components";

export const MainLayout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
`;

export const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents overflow issues */
`;

export const MobileHeader = styled.header`
  display: none;
  height: 4rem;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0 1.25rem;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 90;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

export const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 4rem;
  background: #f8fafc; /* Beautiful soft slate-50 background */

  @media (max-width: 1280px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  margin: 0;
`;

export const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BottomInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }

  &:hover {
    transform: translateY(-0.25rem);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.05),
      0 10px 10px -5px rgba(0, 0, 0, 0.03);
  }
`;

export const InfoIconBox = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #f4f7fe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a365d;
  font-size: 1rem;
  flex-shrink: 0;
`;

export const Footer = styled.footer`
  margin-top: 3rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 640px) {
    gap: 1rem;
  }

  a {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #1a365d;
    }
  }
`;

export const HeaderLogo = styled.img`
  height: 2rem; /* 32px */
`;

export const HeaderTitle = styled.span`
  font-weight: 800;
  color: #1a365d;
  font-size: 1rem; /* 16px */
`;

export const SectionTitleWrapper = styled.div`
  margin-bottom: 1.5rem; /* mb-6 */

  h2.ant-typography {
    font-size: 1.5rem; /* 24px */
    font-weight: 800;
  }
`;

export const InfoCardContent = styled.div`
  h4.ant-typography {
    margin: 0;
    font-size: 1.125rem; /* 18px */
    font-weight: 700;
  }

  span.ant-typography {
    font-size: 0.9375rem; /* 15px */
    display: block;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    color: #8c8c8c; /* type="secondary" */
    line-height: 1.4;
  }

  a {
    color: #1a365d;
    font-weight: 600;
    font-size: 0.875rem; /* 14px */
    text-decoration: none;
  }
`;

export const CopyrightText = styled.div`
  font-weight: 600;
  color: #1a365d;
`;
