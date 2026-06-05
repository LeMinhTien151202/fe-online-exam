import styled from "styled-components";

export const FormHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem; /* Reduced from 3rem */

  h2 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a233a;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025rem;
  }

  p {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  @media (max-height: 750px) {
    margin-bottom: 1.25rem;
    h2 {
      font-size: 1.5rem;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.125rem; /* Reduced from 1.375rem */

  @media (max-height: 750px) {
    gap: 0.875rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem; /* Tighter gap */

  label {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #1a233a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .input-wrapper {
    position: relative;

    .field-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 1.125rem;
    }

    input {
      width: 100%;
      padding: 0.8125rem 1rem 0.8125rem 2.75rem;
      border-radius: 0.625rem;
      border: 1.5px solid #e2e8f0;
      background-color: #f8fafc;
      font-size: 0.9375rem;
      color: #1a233a;
      transition: all 0.2s;

      &:focus {
        background-color: #ffffff;
        border-color: #1a233a;
        outline: none;
      }
    }

    .visibility-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.125rem;
    }
  }
`;

export const UtilityRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.125rem 0;

  .remember-cb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: #64748b;
    font-weight: 600;

    input {
      width: 0.9375rem;
      height: 0.9375rem;
    }
  }

  .forgot-link {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #1a233a;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PrimaryButton = styled.button`
  width: 100%;
  height: 3.25rem; /* Fixed height for consistency */
  background-color: #1a233a;
  color: #ffffff;
  border-radius: 0.625rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background-color: #2c3e50;
    transform: translateY(-1px);
  }
`;

export const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.25rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e2e8f0;
  }

  span {
    padding: 0 1rem;
    color: #94a3b8;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

export const GoogleLoginButton = styled.button`
  width: 100%;
  height: 3.25rem;
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.625rem;
  color: #1a233a;
  font-weight: 600;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;

  img {
    height: 1.25rem;
  }
`;

export const FormFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9375rem;
  color: #64748b;

  a {
    color: #1a233a;
    font-weight: 800;
    margin-left: 0.375rem;
    text-decoration: none;
  }
`;
