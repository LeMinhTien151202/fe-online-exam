import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageHeader = styled.header`
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;

  h1 {
    font-size: 1.75rem;
    color: #1a233a;
    font-weight: 800;
    letter-spacing: -0.05rem;
    margin: 0;
  }

  p {
    color: #64748b;
    margin-top: 0.375rem;
    font-size: 0.9375rem;
  }
`;

export const MainGrid = styled.main`
  display: grid;
  grid-template-columns: 20rem 1fr;
  gap: 1.5rem;
  width: 100%;
  align-items: start;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`;

// --- Shared Card Base ---
const Card = styled.div`
  background: #ffffff;
  border-radius: 0.75rem;
  border: 0.0625rem solid #e2e8f0;
  box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

// --- Summary Card ---
export const SummaryCard = styled(Card)`
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: #1a233a;
  color: white;
  font-size: 2.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 800;
  border: 0.125rem solid #fff;
  box-shadow: 0 0.375rem 1rem rgba(26, 35, 58, 0.1);

  .edit-overlay {
    position: absolute;
    bottom: 0.125rem;
    right: 0.125rem;
    width: 1.75rem;
    height: 1.75rem;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1a233a;
    box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: 0.0625rem solid #ffffff;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
      background: #1a233a;
      color: #fff;
    }

    span {
      font-size: 1rem !important;
    }
  }
`;

export const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a233a;
  margin: 0.25rem 0 1rem 0;
`;

export const ProfileStatsList = styled.div`
  width: 100%;
  padding-top: 1.25rem;
  border-top: 0.0625rem solid #f1f5f9;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.875rem;
  gap: 0.5rem;

  .label {
    font-weight: 700;
    color: #475569;
    flex-shrink: 0;
  }

  .value {
    color: #1a233a;
    font-weight: 600;
    text-align: right;
  }

  .status-badge {
    background: #dcfce7;
    color: #166534;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 800;
    font-size: 0.6875rem;
  }
`;

export const ProfileActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;

  button {
    flex: 1;
  }
`;

// --- Details Card ---
export const DetailsCard = styled(Card)`
  padding: 1.5rem 2.5rem;

  @media (max-width: 40rem) {
    padding: 1.25rem 1.5rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.625rem;
  border-bottom: 0.0625rem solid #f1f5f9;

  span.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: #f8fafc;
    border-radius: 0.3125rem;
    color: #1a233a;
    font-size: 1.125rem;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  color: #1a233a;
  font-weight: 700;
  margin: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 2rem;
  margin-bottom: 2rem;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  label {
    font-size: 0.75rem;
    color: #475569;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .input-wrapper {
    position: relative;

    input,
    select {
      width: 100%;
      padding: 0.5625rem 0.875rem;
      border-radius: 0.375rem;
      border: 0.0625rem solid #cbd5e1;
      background-color: #f8fafc;
      font-size: 0.9375rem;
      color: #1a233a;
      font-weight: 500;
      outline: none;
      transition: all 0.2s;
      appearance: none;

      &::placeholder {
        color: #94a3b8;
        font-weight: 400;
      }

      &:focus {
        border-color: #1a233a;
        background-color: #fff;
        box-shadow: 0 0 0 0.1875rem rgba(26, 35, 58, 0.05);
      }
    }

    select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.875rem center;
      background-size: 0.875rem;
      padding-right: 2.25rem;
    }
  }
`;

export const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 0.0625rem solid #f8fafc;
`;

export const SaveButton = styled.button`
  padding: 0.625rem 1.75rem;
  background: #1a233a;
  color: #ffffff;
  border-radius: 0.375rem;
  border: none;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2c3e50;
    transform: translateY(-0.0625rem);
  }
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1.75rem;
  background: #fff;
  color: #475569;
  border-radius: 0.375rem;
  border: 0.0625rem solid #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.4375rem 1rem;
  background: transparent;
  color: #1a233a;
  border-radius: 0.375rem;
  border: 0.0625rem solid #cbd5e1;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

export const OutlineButton = styled.button<{ color?: string }>`
  padding: 0.4375rem 1rem;
  background: transparent;
  color: ${(props) => props.color || "#1A233A"};
  border-radius: 0.375rem;
  border: 0.0625rem solid ${(props) => props.color || "#CBD5E1"};
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;
