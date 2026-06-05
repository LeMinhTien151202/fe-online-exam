import React from 'react';
import { Link } from '@tanstack/react-router';
import AuthLayout from '../../../components/AuthLayout';
import * as S from '../styles/register.styled';

const RegisterPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                        <input type="text" placeholder="Nguyễn Văn A" required />
                    </div>
                </S.FormGroup>

                <S.FormGroup>
                    <label>Email học viên</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">mail</span>
                        <input type="email" placeholder="thisinh@gmail.com" required />
                    </div>
                </S.FormGroup>

                <S.FormGroup>
                    <label>Mật khẩu</label>
                    <div className="input-wrapper">
                        <span className="material-symbols-outlined field-icon">lock</span>
                        <input type="password" placeholder="••••••••" required />
                    </div>
                </S.FormGroup>

                <S.PrimaryButton type="submit">Đăng ký ngay</S.PrimaryButton>
            </S.Form>

            <S.FormFooter>
                Đã có tài khoản?
                <Link to="/login">Đăng nhập ngay</Link>
            </S.FormFooter>
        </AuthLayout>
    );
};

export default RegisterPage;
