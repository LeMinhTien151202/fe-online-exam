import React from 'react';
import { RiseOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { IHomeStats } from '../services/types';
import * as S from './StatsSection.styled';

interface StatsSectionProps {
  stats: IHomeStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <S.StatsGrid>
      <S.StatCard>
        <S.IconWrapper $bgColor="#e0f2fe" $color="#0369a1">
          <RiseOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Tiến độ Tổng quan</S.Label>
          <S.Value>{stats.overallProgress}%</S.Value>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.IconWrapper $bgColor="#f3e8ff" $color="#7e22ce">
          <CheckCircleOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Học phần Đã hoàn thành</S.Label>
          <S.Value>{stats.completedModules} / {stats.totalModules}</S.Value>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.IconWrapper $bgColor="#dcfce7" $color="#15803d">
          <TrophyOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Mục tiêu Trình độ</S.Label>
          <S.Value>{stats.targetLevel}</S.Value>
        </div>
      </S.StatCard>
    </S.StatsGrid>
  );
};
