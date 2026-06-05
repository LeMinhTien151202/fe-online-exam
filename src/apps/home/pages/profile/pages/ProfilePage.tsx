import React, { useState } from 'react';
import * as S from '../styles/profile.styled';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileField from '../components/ProfileField';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { DashboardLayout } from '../../../components/DashboardLayout';

const ProfilePage: React.FC = () => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <S.PageHeader>
                <h1>Hồ sơ cá nhân</h1>
                <p>Quản lý thông tin tài khoản và thiết lập quyền riêng tư của bạn</p>
            </S.PageHeader>

            <S.MainGrid>
                {/* Left Column: Profile Summary */}
                <S.SummaryCard>
                    <ProfileAvatar initials="T" />

                    <S.UserName>Lê Minh Tiến</S.UserName>

                    <S.ProfileStatsList>
                        <S.StatItem>
                            <span className="label">Full name:</span>
                            <span className="value">Lê Minh Tiến</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Email:</span>
                            <span className="value">leminhtien@gmail.com</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Phone:</span>
                            <span className="value">Chưa có</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Trạng thái:</span>
                            <span className="status-badge">Đã kích hoạt</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Ngày thi:</span>
                            <span className="value">07/02/2026</span>
                        </S.StatItem>
                    </S.ProfileStatsList>

                    <S.ProfileActionRow>
                        <S.OutlineButton onClick={() => setIsPasswordModalOpen(true)}>Đổi mật khẩu</S.OutlineButton>
                        <S.OutlineButton color="#EF4444">Đăng xuất</S.OutlineButton>
                    </S.ProfileActionRow>
                </S.SummaryCard>

                {/* Right Column: Edit Details */}
                <S.DetailsCard>
                    <S.SectionHeader>
                        <span className="icon material-symbols-outlined">person</span>
                        <S.SectionTitle>Thông tin cơ bản</S.SectionTitle>
                    </S.SectionHeader>

                    <S.FormGrid>
                        <ProfileField
                            id="fullName"
                            label="Họ và tên"
                            defaultValue="Lê Minh Tiến"
                            placeholder="Nhập họ và tên"
                        />
                        <ProfileField
                            id="email"
                            label="Địa chỉ Email"
                            type="email"
                            defaultValue="leminhtien1202@gmail.com"
                            placeholder="name@example.com"
                        />
                        <ProfileField
                            id="dob"
                            label="Ngày sinh"
                            defaultValue="15/12/2002"
                            placeholder="15/12/2002"
                        />
                        <ProfileField
                            id="phone"
                            label="Số điện thoại"
                            type="tel"
                            placeholder="090x xxx xxx"
                        />
                        <ProfileField
                            id="examDateComp"
                            label="Ngày thi dự kiến"
                            type="date"
                            defaultValue="2026-02-07"
                        />
                        <ProfileField
                            id="goal"
                            label="Mục tiêu Aptis"
                            isSelect={true}
                            defaultValue="B2"
                        >
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C">C</option>
                        </ProfileField>
                    </S.FormGrid>

                    <S.SectionHeader>
                        <span className="icon material-symbols-outlined">shield</span>
                        <S.SectionTitle>Địa chỉ & Bảo mật</S.SectionTitle>
                    </S.SectionHeader>

                    <S.FormGrid>
                        <ProfileField
                            id="city"
                            label="Thành phố đang sống"
                            defaultValue="Hà Nội"
                            placeholder="Ví dụ: Hà Nội"
                        />
                        <ProfileField
                            id="language"
                            label="Ngôn ngữ màn hình"
                            defaultValue="Tiếng Việt"
                        />
                    </S.FormGrid>

                    <S.ActionArea>
                        <S.CancelButton type="button">Hủy bỏ</S.CancelButton>
                        <S.SaveButton type="button">Lưu thay đổi</S.SaveButton>
                    </S.ActionArea>
                </S.DetailsCard>
            </S.MainGrid>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </DashboardLayout>
    );
};

export default ProfilePage;
