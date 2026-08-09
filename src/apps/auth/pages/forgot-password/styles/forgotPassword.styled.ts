import styled from 'styled-components';

// Chuỗi ô nhập OTP (mỗi ký tự một ô vuông).
export const OtpRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625rem;
  margin: 0.5rem 0 0.25rem;

  input {
    width: 3rem;
    height: 3.5rem;
    text-align: center;
    font-size: 1.375rem;
    font-weight: 800;
    color: #1a233a;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.625rem;
    background-color: #f8fafc;
    transition: all 0.2s;

    &:focus {
      background-color: #ffffff;
      border-color: #1a233a;
      outline: none;
    }
  }

  @media (max-width: 420px) {
    gap: 0.375rem;
    input {
      width: 2.5rem;
      height: 3rem;
      font-size: 1.125rem;
    }
  }
`;

// Dòng gửi lại mã: đồng hồ đếm ngược hoặc nút gửi lại.
export const ResendRow = styled.div`
  text-align: center;
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.25rem;

  button {
    background: none;
    border: none;
    color: #1a233a;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    font-size: 0.8125rem;

    &:disabled {
      color: #94a3b8;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      text-decoration: underline;
    }
  }
`;

// Nút quay lại bước trước / về đăng nhập.
export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.25rem;

  &:hover {
    color: #1a233a;
  }

  .material-symbols-outlined {
    font-size: 1.125rem;
  }
`;

// Hiển thị email đang đặt lại mật khẩu ở bước OTP.
export const TargetEmail = styled.span`
  font-weight: 800;
  color: #1a233a;
`;

// Chỉ báo bước hiện tại (1/2/3).
export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  .dot {
    width: 2rem;
    height: 0.3125rem;
    border-radius: 999px;
    background-color: #e2e8f0;
    transition: background-color 0.2s;

    &.active {
      background-color: #1a233a;
    }
  }
`;

// Thông báo thành công ở bước cuối.
export const SuccessBox = styled.div`
  text-align: center;
  padding: 1rem 0;

  .icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background-color: #dcfce7;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;

    .material-symbols-outlined {
      font-size: 2.25rem;
    }
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1a233a;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }
`;
