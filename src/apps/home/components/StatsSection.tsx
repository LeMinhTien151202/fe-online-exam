import React from 'react';
import {
  RiseOutlined,
  FireOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { IHomeStats } from '../services/types';
import * as S from './StatsSection.styled';

interface StatsSectionProps {
  stats: IHomeStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
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
          <S.Value>{stats.learningStreak} ngày</S.Value>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.IconWrapper $bgColor="#dcfce7" $color="#16a34a">
          <CheckCircleOutlined />
        </S.IconWrapper>
        <div>
          <S.Label>Số học phần</S.Label>
          <S.Value>{stats.completedModules} / {stats.totalModules}</S.Value>
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
