import React from 'react';
import {
  RiseOutlined,
  FireOutlined,
  TrophyOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { IHomeStats } from '../services/types';
import * as S from './StatsSection.styled';

interface StatsSectionProps {
  stats: IHomeStats;
  isStreakLoading?: boolean;
  isStreakError?: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats, isStreakLoading, isStreakError }) => {
  return (
    <S.StatsGrid>
      <S.StatCard>
        <S.IconWrapper $bgColor="#e0f2fe" $color="#0284c7">
          <RiseOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Tiến độ Tổng quan</S.Label>
          <S.Value>{stats.overallProgress}%</S.Value>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.IconWrapper $bgColor="#ffedd5" $color="#ea580c">
          <FireOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Chuỗi học tập</S.Label>
          <S.Value>{isStreakLoading || isStreakError ? '—' : `${stats.learningStreak} ngày`}</S.Value>
        </div>
      </S.StatCard>



      <S.StatCard>
        <S.IconWrapper $bgColor="#fef3c7" $color="#d97706">
          <TrophyOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Mục tiêu Trình độ</S.Label>
          <S.Value>{stats.targetLevel}</S.Value>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.IconWrapper $bgColor="#f3e8ff" $color="#7e22ce">
          <LineChartOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Điểm dự đoán</S.Label>
          <S.Value>{stats.predictedScore}</S.Value>
        </div>
      </S.StatCard>
    </S.StatsGrid>
  );
};
