import { useCallback, useEffect, useState } from 'react';
import { toast } from '../../../../../configs/toast';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from '@apps/auth/services/authQuery';

export type ForgotStep = 'email' | 'otp' | 'password' | 'done';

const RESEND_COOLDOWN = 60; // giây — khớp OTP_RESEND_COOLDOWN mặc định ở backend.

export const useForgotPassword = () => {
  const [step, setStep] = useState<ForgotStep>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const forgotMutation = useForgotPasswordMutation();
  const verifyMutation = useVerifyOtpMutation();
  const resetMutation = useResetPasswordMutation();

  // Đếm ngược thời gian được phép gửi lại mã.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestOtp = useCallback(
    (targetEmail: string) => {
      forgotMutation.mutate(
        { email: targetEmail },
        {
          onSuccess: () => {
            setEmail(targetEmail);
            setStep('otp');
            setCooldown(RESEND_COOLDOWN);
            toast.success('Mã OTP đã được gửi tới email của bạn (nếu email tồn tại).');
          },
        },
      );
    },
    [forgotMutation],
  );

  const resendOtp = useCallback(() => {
    if (cooldown > 0 || !email) return;
    forgotMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setCooldown(RESEND_COOLDOWN);
          toast.success('Đã gửi lại mã OTP.');
        },
      },
    );
  }, [cooldown, email, forgotMutation]);

  const verifyOtp = useCallback(
    (otp: string) => {
      verifyMutation.mutate(
        { email, otp },
        {
          onSuccess: (res) => {
            setResetToken(res.resetToken);
            setStep('password');
          },
        },
      );
    },
    [email, verifyMutation],
  );

  const resetPassword = useCallback(
    (newPassword: string) => {
      resetMutation.mutate(
        { resetToken, newPassword },
        {
          onSuccess: () => {
            setStep('done');
            toast.success('Đặt lại mật khẩu thành công!');
          },
        },
      );
    },
    [resetToken, resetMutation],
  );

  const backToEmail = useCallback(() => setStep('email'), []);

  return {
    step,
    email,
    cooldown,
    requestOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
    backToEmail,
    isRequesting: forgotMutation.isPending,
    isVerifying: verifyMutation.isPending,
    isResetting: resetMutation.isPending,
  };
};
