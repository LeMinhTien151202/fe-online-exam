import styled from 'styled-components';

export const LoadingWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 0;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 14px;
`;

export const SkeletonBlock = styled.div`
  height: 140px;
  border-radius: 10px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e8eef5 37%, #f1f5f9 63%);
  background-size: 400% 100%;
  animation: exam-skeleton 1.4s ease infinite;

  @keyframes exam-skeleton {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;

export const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 360px;
  padding: 3rem 1.5rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #eef2f8;
  color: #3b5b8c;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;

export const EmptyText = styled.p`
  margin: 0 0 0.75rem;
  max-width: 420px;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.55;
`;
