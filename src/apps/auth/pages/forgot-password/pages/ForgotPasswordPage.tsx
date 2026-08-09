import React, { useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import AuthLayout from '../../../components/AuthLayout';
import { useForgotPassword } from '../hook/useForgotPassword';
import { toast } from '../../../../../configs/toast';
import * as S from '../../login/styles/login.styled';
import * as F from '../styles/forgotPassword.styled';

const OTP_LENGTH = 6;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    step,
    email,
    cooldown,
    requestOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
    backToEmail,
    isRequesting,
    isVerifying,
    isResetting,
  } = useForgotPassword();

  // State cục bộ cho từng bước (Dumb-ish form state).
  const [emailInput, setEmailInput] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const stepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestOtp(emailInput.trim());
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      toast.warning('Vui lòng nhập đủ mã OTP.');
      return;
    }
    verifyOtp(code);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.warning('Mật khẩu mới phải chứa ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirm) {
      toast.warning('Mật khẩu xác nhận không khớp.');
      return;
    }
    resetPassword(password);
  };

  return (
    <AuthLayout>
      {step !== 'done' && (
        <F.StepIndicator>
          {[0, 1, 2].map((i) => (
            <div key={i} className={`dot ${i <= stepIndex ? 'active' : ''}`} />
          ))}
        </F.StepIndicator>
      )}

      {/* BƯỚC 1: Nhập email */}
      {step === 'email' && (
        <>
          <S.FormHeader>
            <h2>Quên mật khẩu?</h2>
            <p>Nhập email tài khoản, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
          </S.FormHeader>
          <S.Form onSubmit={handleEmailSubmit}>
            <S.FormGroup>
              <label>Email học viên</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined field-icon">mail</span>
                <input
                  type="email"
                  placeholder="thisinh@gmail.com"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </S.FormGroup>
            <S.PrimaryButton type="submit" disabled={isRequesting}>
              {isRequesting ? 'Đang gửi mã...' : 'Gửi mã OTP'}
            </S.PrimaryButton>
          </S.Form>
          <S.FormFooter>
            Nhớ mật khẩu rồi?
            <Link to="/login">Quay lại đăng nhập</Link>
          </S.FormFooter>
        </>
      )}

      {/* BƯỚC 2: Nhập OTP */}
      {step === 'otp' && (
        <>
          <F.BackLink type="button" onClick={backToEmail}>
            <span className="material-symbols-outlined">arrow_back</span> Đổi email
          </F.BackLink>
          <S.FormHeader>
            <h2>Nhập mã OTP</h2>
            <p>
              Mã gồm {OTP_LENGTH} chữ số đã gửi tới <F.TargetEmail>{email}</F.TargetEmail>
            </p>
          </S.FormHeader>
          <S.Form onSubmit={handleOtpSubmit}>
            <F.OtpRow onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </F.OtpRow>
            <S.PrimaryButton type="submit" disabled={isVerifying}>
              {isVerifying ? 'Đang xác thực...' : 'Xác nhận'}
            </S.PrimaryButton>
          </S.Form>
          <F.ResendRow>
            {cooldown > 0 ? (
              <span>Gửi lại mã sau {cooldown}s</span>
            ) : (
              <button type="button" onClick={resendOtp} disabled={isRequesting}>
                Gửi lại mã OTP
              </button>
            )}
          </F.ResendRow>
        </>
      )}

      {/* BƯỚC 3: Đặt mật khẩu mới */}
      {step === 'password' && (
        <>
          <S.FormHeader>
            <h2>Đặt mật khẩu mới</h2>
            <p>Tạo mật khẩu mới cho tài khoản của bạn.</p>
          </S.FormHeader>
          <S.Form onSubmit={handlePasswordSubmit}>
            <S.FormGroup>
              <label>Mật khẩu mới</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined field-icon">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="material-symbols-outlined visibility-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </S.FormGroup>
            <S.FormGroup>
              <label>Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined field-icon">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </S.FormGroup>
            <S.PrimaryButton type="submit" disabled={isResetting}>
              {isResetting ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
            </S.PrimaryButton>
          </S.Form>
        </>
      )}

      {/* BƯỚC 4: Hoàn tất */}
      {step === 'done' && (
        <F.SuccessBox>
          <div className="icon">
            <span className="material-symbols-outlined">check</span>
          </div>
          <h3>Đặt lại mật khẩu thành công!</h3>
          <p>Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.</p>
          <S.PrimaryButton type="button" onClick={() => navigate({ to: '/login' })}>
            Về trang đăng nhập
          </S.PrimaryButton>
        </F.SuccessBox>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
