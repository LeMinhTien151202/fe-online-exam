import styled from "styled-components";

export const AuthLayoutContainer = styled.div`
  display: flex;
  height: 100vh; /* Fixed height to prevent scroll */
  width: 100%;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  background-color: #f4f7fe;
  overflow: hidden; /* Lock scroll on desktop */

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    overflow: auto;
  }
`;

// --- Left Panel (Branding) ---
export const BrandPanel = styled.section`
  flex: 0.85;
  background-color: #1a233a;
  display: flex;
  flex-direction: column;
  justify-content: space-around; /* Better distribution for tight heights */
  padding: 3rem; /* Reduced padding further */
  color: #ffffff;
  position: relative;
  overflow: hidden;

  @media (max-height: 700px) {
    padding: 2rem;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const HeroContent = styled.div`
  width: 100%;
  max-width: 32rem;
  position: relative;
  z-index: 2;
`;

export const BrandLogo = styled.img`
  height: 3.75rem;
  width: auto;
  margin-bottom: 2rem;
  object-fit: contain;

  @media (max-height: 750px) {
    height: 3rem;
    margin-bottom: 1.5rem;
  }
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vh, 2.75rem); /* Scalable size */
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

export const HeroSubtitle = styled.p`
  font-size: 1.0625rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 2rem;

  @media (max-height: 750px) {
    margin-bottom: 1.5rem;
  }
`;

export const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;

  @media (max-height: 750px) {
    gap: 0.75rem;
  }
`;

export const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  font-size: 1rem;
  color: #e2e8f0;

  .check-dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #3b82f6;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export const StatsWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 32rem;
  background: rgba(255, 255, 255, 0.03);
  border: 0.0625rem solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.25rem 1.75rem;
  display: flex;
  justify-content: space-between;

  @media (max-height: 650px) {
    display: none; /* Hide on extremely small heights */
  }
`;

export const StatItem = styled.div`
  text-align: center;
  .value {
    font-size: 1.375rem;
    font-weight: 800;
    color: #ffffff;
    display: block;
  }
  .label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

// --- Right Panel (Form Area) ---
export const FormPanel = styled.section`
  flex: 1.15;
  background-color: #f4f7fe;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow-y: auto; /* Allow internal scroll only if card exceeds viewport */
`;

export const AuthCard = styled.div`
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 3.5rem 2.5rem; /* Reduced padding from 4rem 3rem */
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 1.25rem 3.5rem rgba(0, 0, 0, 0.05);

  @media (max-height: 750px) {
    padding: 2.5rem 2rem;
  }
`;
