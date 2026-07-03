import React, { useState, useEffect } from 'react';
import * as S from '../styles/profile.styled';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileField from '../components/ProfileField';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { useProfile } from '../hook/useProfile';
import { useAppSelector } from '@/shared/store/hooks';
import { useLogout } from '@/shared/hooks/useLogout';
import { AptisGoal, IProfile } from '../services/types';
import { useNavigate } from '@tanstack/react-router';

const toDateInputValue = (isoDate: string | null): string => (isoDate ? isoDate.slice(0, 10) : '');

const ProfilePage: React.FC = () => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const { logout } = useLogout();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { profile, isLoading, updateProfile, isUpdating } = useProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: '/login' });
        }
    }, [isAuthenticated, navigate]);

    const [fullName, setFullName] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [aptisGoal, setAptisGoal] = useState<AptisGoal>('B2');
    const [schoolName, setSchoolName] = useState('');

    // Nạp dữ liệu form từ profile vừa fetch xong (điều chỉnh state khi props/data đổi, theo khuyến nghị của React thay vì dùng useEffect)
    const [loadedProfile, setLoadedProfile] = useState<IProfile | null>(null);
    if (profile && profile !== loadedProfile) {
        setLoadedProfile(profile);
        setFullName(profile.fullName || '');
        setTargetDate(toDateInputValue(profile.targetDate));
        setAptisGoal(profile.aptisGoal || 'B2');
        setSchoolName(profile.schoolName || '');
    }

    const displayName = profile?.fullName || user?.fullName || user?.email || 'Thí sinh';
    const avatarInitials = displayName.charAt(0).toUpperCase();

    const handleSave = () => {
        updateProfile({
            full_name: fullName,
            target_date: targetDate || undefined,
            aptis_goal: aptisGoal,
            school_name: schoolName || undefined,
        });
    };

    const handleReset = () => {
        if (!profile) return;
        setFullName(profile.fullName || '');
        setTargetDate(toDateInputValue(profile.targetDate));
        setAptisGoal(profile.aptisGoal || 'B2');
        setSchoolName(profile.schoolName || '');
    };

    if (!isAuthenticated) return null;
    if (isLoading) return <div>Đang tải hồ sơ...</div>;

    return (
        <DashboardLayout>
            <S.PageHeader>
                <h1>Hồ sơ cá nhân</h1>
                <p>Quản lý thông tin tài khoản và thiết lập quyền riêng tư của bạn</p>
            </S.PageHeader>

            <S.MainGrid>
                {/* Left Column: Profile Summary */}
                <S.SummaryCard>
                    <ProfileAvatar initials={avatarInitials} />

                    <S.UserName>{displayName}</S.UserName>

                    <S.ProfileStatsList>
                        <S.StatItem>
                            <span className="label">Full name:</span>
                            <span className="value">{displayName}</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Email:</span>
                            <span className="value">{user?.email || 'Chưa có'}</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Trạng thái:</span>
                            <span className="status-badge">{user?.status === 'LOCKED' ? 'Đã khoá' : 'Đã kích hoạt'}</span>
                        </S.StatItem>
                        <S.StatItem>
                            <span className="label">Ngày thi:</span>
                            <span className="value">{profile?.targetDate ? toDateInputValue(profile.targetDate) : 'Chưa đặt'}</span>
                        </S.StatItem>
                    </S.ProfileStatsList>

                    <S.ProfileActionRow>
                        <S.OutlineButton onClick={() => setIsPasswordModalOpen(true)}>Đổi mật khẩu</S.OutlineButton>
                        <S.OutlineButton color="#EF4444" onClick={logout}>Đăng xuất</S.OutlineButton>
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
                            value={fullName}
                            onChange={setFullName}
                            placeholder="Nhập họ và tên"
                        />
                        <ProfileField
                            id="schoolName"
                            label="Trường học"
                            value={schoolName}
                            onChange={setSchoolName}
                            placeholder="Ví dụ: THPT ABC"
                        />
                        <ProfileField
                            id="examDateComp"
                            label="Ngày thi dự kiến"
                            type="date"
                            value={targetDate}
                            onChange={setTargetDate}
                        />
                        <ProfileField
                            id="goal"
                            label="Mục tiêu Aptis"
                            isSelect={true}
                            value={aptisGoal}
                            onChange={(v) => setAptisGoal(v as AptisGoal)}
                        >
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C">C</option>
                        </ProfileField>
                    </S.FormGrid>

                    <S.ActionArea>
                        <S.CancelButton type="button" onClick={handleReset}>
                            Hủy bỏ
                        </S.CancelButton>
                        <S.SaveButton type="button" onClick={handleSave} disabled={isUpdating}>
                            {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </S.SaveButton>
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
