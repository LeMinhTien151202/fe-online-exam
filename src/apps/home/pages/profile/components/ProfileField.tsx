import React from 'react';
import * as S from '../styles/profile.styled';

interface ProfileFieldProps {
    label: string;
    id: string;
    type?: string;
    defaultValue?: string;
    placeholder?: string;
    isSelect?: boolean;
    children?: React.ReactNode;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    id,
    type = 'text',
    defaultValue,
    placeholder,
    isSelect = false,
    children
}) => {
    return (
        <S.FormGroup>
            <label htmlFor={id}>{label}</label>
            <div className="input-wrapper">
                {isSelect ? (
                    <select id={id} defaultValue={defaultValue}>
                        {children}
                    </select>
                ) : (
                    <input
                        id={id}
                        type={type}
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                    />
                )}
            </div>
        </S.FormGroup>
    );
};

export default ProfileField;
