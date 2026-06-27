import React from 'react';
import { ILearningModule } from '../services/types';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRightOutlined } from '@ant-design/icons';
import * as S from './ModuleGrid.styled';

interface ModuleGridProps {
  modules: ILearningModule[];
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ modules }) => {
  const navigate = useNavigate();
  const colorMap = {
    red: { bg: '#fee2e2', text: '#dc2626', decor: '#ef4444' },
    orange: { bg: '#ffedd5', text: '#ea580c', decor: '#f97316' },
    blue: { bg: '#dbeafe', text: '#2563eb', decor: '#3b82f6' },
    purple: { bg: '#f3e8ff', text: '#9333ea', decor: '#a855f7' },
    teal: { bg: '#ccfbf1', text: '#0d9488', decor: '#14b8a6' },
    green: { bg: '#dcfce7', text: '#16a34a', decor: '#22c55e' },
  };

  const handleCardClick = (e: React.MouseEvent, module: ILearningModule) => {
    e.preventDefault();
    if (module.id === 'reading') {
      navigate({ to: '/reading' });
    } else if (module.id === 'speaking') {
      navigate({ to: '/speaking' });
    } else if (module.id === 'listening') {
      navigate({ to: '/listening' });
    } else if (module.id === 'writing') {
      navigate({ to: '/writing' });
    } else if (module.id === 'grammar') {
      navigate({ to: '/grammar' });
    }
  };

  return (
    <S.Grid>
      {modules.map((module) => {
        const colors = colorMap[module.color as keyof typeof colorMap] || colorMap.blue;
        return (
          <S.Card
            key={module.id}
            as="div"
            style={{ cursor: 'pointer' }}
            onClick={(e) => handleCardClick(e as any, module)}
          >
            <S.DecorCircle $color={colors.decor} />
            <div className="relative z-10 flex flex-col h-full">
              <S.IconBox $bgColor={colors.bg} $color={colors.text}>
                <span className="material-symbols-outlined">{module.icon}</span>
              </S.IconBox>

              <S.Title>{module.title}</S.Title>
              <S.Description>{module.description}</S.Description>

              <S.ActionLink>
                <span>Luyện tập ngay</span>
                <ArrowRightOutlined style={{ fontSize: '0.75rem' }} />
              </S.ActionLink>
            </div>
          </S.Card>
        );
      })}
    </S.Grid>
  );
};
