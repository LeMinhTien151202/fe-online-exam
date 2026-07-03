import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { message } from 'antd';
import AuthLayout from '../../../components/AuthLayout';
import { useRegister } from '../hook/useRegister';
import * as S from '../styles/register.styled';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, isRegistering } = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            message.error('Mật khẩu nhập lại không khớp!');
            return;
        }
        register({ full_name: fullName, email, password });
    };

    return (
        <AuthLayout>
            <S.FormHeader>
                <h2>Đăng ký tài khoản</h2>
                <p>Tạo tài khoản để nhận lộ trình học tập miễn phí.</p>
            </S.FormHeader>

            <S.Form onSubmit={handleSubmit}>
                <S.FormGroup>
                    <label>Họ và tên</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">badge</span>
                        <input
                            type="text"
                            placeholder="Nguyễn Văn A"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                </S.FormGroup>

                <S.FormGroup>
                    <label>Email học viên</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">mail</span>
                        <input
                            type="email"
                            placeholder="thisinh@gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </S.FormGroup>

                <S.FormGroup>
                    <label>Mật khẩu</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">lock</span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </S.FormGroup>

                <S.FormGroup>
                    <label>Nhập lại mật khẩu</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">lock_reset</span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </S.FormGroup>

                <S.PrimaryButton type="submit" disabled={isRegistering}>
                    {isRegistering ? 'Đang xử lý...' : 'Đăng ký ngay'}
                </S.PrimaryButton>
            </S.Form>

            <S.FormFooter>
                Đã có tài khoản?
                <Link to="/login">Đăng nhập ngay</Link>
            </S.FormFooter>
        </AuthLayout>
    );
};

export default RegisterPage;
