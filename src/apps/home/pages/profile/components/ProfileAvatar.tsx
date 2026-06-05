import React from 'react';
import * as S from '../styles/profile.styled';

interface ProfileAvatarProps {
    initials: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ initials }) => {
    return (
        <S.AvatarWrapper>
            {initials}
            <div className="edit-overlay">
                <span className="material-symbols-outlined">edit</span>
            </div>
        </S.AvatarWrapper>
    );
};

export default ProfileAvatar;
