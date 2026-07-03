import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import AuthLayout from '../../../components/AuthLayout';
import { useLogin } from '../hook/useLogin';
import { authApi } from '@apps/auth/services/authApi';
import * as S from '../styles/login.styled';

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggingIn } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ username, password });
    };

    const handleGoogleLogin = () => {
        window.location.href = authApi.googleLoginUrl();
    };

    return (
        <AuthLayout>
            <S.FormHeader>
                <h2>Đăng nhập tài khoản</h2>
                <p>Nhập email và mật khẩu để tiếp tục hành trình.</p>
            </S.FormHeader>

            <S.Form onSubmit={handleSubmit}>
                <S.FormGroup>
                    <label>Email học viên</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">person</span>
                        <input
                            type="email"
                            placeholder="thisinh@gmail.com"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </S.FormGroup>

                <S.FormGroup>
                    <label>Mật khẩu</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">lock</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="material-symbols-outlined visibility-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </div>
                </S.FormGroup>

                <S.UtilityRow>
                    <label className="remember-cb">
                        <input type="checkbox" /> Ghi nhớ đăng nhập
                    </label>
                    <Link to="/login" className="forgot-link">Quên mật khẩu?</Link>
                </S.UtilityRow>

                <S.PrimaryButton type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </S.PrimaryButton>
            </S.Form>

            <S.SocialDivider>
                <span>hoặc đăng nhập bằng</span>
            </S.SocialDivider>

            <S.GoogleLoginButton type="button" onClick={handleGoogleLogin}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Tiếp tục với Google
            </S.GoogleLoginButton>

            <S.FormFooter>
                Chưa có tài khoản?
                <Link to="/register">Đăng ký miễn phí</Link>
            </S.FormFooter>
        </AuthLayout>
    );
};

export default LoginPage;
