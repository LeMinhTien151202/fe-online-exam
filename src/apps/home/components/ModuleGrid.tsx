import React from 'react';
import { ILearningModule } from '../services/types';
import * as S from './ModuleGrid.styled';

interface ModuleGridProps {
  modules: ILearningModule[];
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ modules }) => {
  const colorMap = {
    red: { bg: '#fee2e2', text: '#dc2626', decor: '#ef4444' },
    orange: { bg: '#ffedd5', text: '#ea580c', decor: '#f97316' },
    blue: { bg: '#dbeafe', text: '#2563eb', decor: '#3b82f6' },
    purple: { bg: '#f3e8ff', text: '#9333ea', decor: '#a855f7' },
    teal: { bg: '#ccfbf1', text: '#0d9488', decor: '#14b8a6' },
    green: { bg: '#dcfce7', text: '#16a34a', decor: '#22c55e' },
  };

  return (
    <S.Grid>
      {modules.map((module) => {
        const colors = colorMap[module.color];
        return (
          <S.Card key={module.id} href={module.path}>
            <S.DecorCircle $color={colors.decor} />
            <div className="relative z-10 flex flex-col h-full">
              <S.IconBox $bgColor={colors.bg} $color={colors.text}>
                <span className="material-symbols-outlined">{module.icon}</span>
              </S.IconBox>
              <S.Title>{module.title}</S.Title>
              <S.Description>{module.description}</S.Description>
              <S.Footer>
                <S.Tag $bgColor={colors.bg} $color={colors.text}>
                  {module.duration}
                </S.Tag>
                <S.ArrowIcon />
              </S.Footer>
            </div>
          </S.Card>
        );
      })}
    </S.Grid>
  );
};
