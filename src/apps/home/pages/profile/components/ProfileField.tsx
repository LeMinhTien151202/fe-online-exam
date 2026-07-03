import React from 'react';
import * as S from '../styles/profile.styled';

interface ProfileFieldProps {
    label: string;
    id: string;
    type?: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    isSelect?: boolean;
    children?: React.ReactNode;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    isSelect = false,
    children
}) => {
    return (
        <S.FormGroup>
            <label htmlFor={id}>{label}</label>
            <div className="input-wrapper">
                {isSelect ? (
                    <select
                        id={id}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                    >
                        {children}
                    </select>
                ) : (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                    />
                )}
            </div>
        </S.FormGroup>
    );
};

export default ProfileField;
