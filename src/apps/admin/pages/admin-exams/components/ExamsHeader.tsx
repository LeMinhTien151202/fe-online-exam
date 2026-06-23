import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import * as S from '../../../styles/shared.styled';

interface ExamsHeaderProps {
    title: string;
    onCreateNew: () => void;
    buttonText: string;
}

export const ExamsHeader: React.FC<ExamsHeaderProps> = ({ title, onCreateNew, buttonText }) => {
    return (
        <S.PageHeader>
            <div>
                <h1>{title}</h1>
                <p>Thống kê và quản lý các bộ đề thi Aptis hiện có</p>
            </div>
            <S.PrimaryButton
                type="primary"
                onClick={onCreateNew}
            >
                <PlusOutlined /> {buttonText}
            </S.PrimaryButton>
        </S.PageHeader>
    );
};
