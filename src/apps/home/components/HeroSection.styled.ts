import styled from 'styled-components';
import { Button } from 'antd';
import { StarFilled } from '@ant-design/icons';

export const HeroContainer = styled.div`
  background: #2D447F; /* Màu xanh chuẩn theo ảnh mẫu */
  border-radius: 1.5rem;
  padding: 2.25rem 3rem;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(45, 68, 127, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 0.375rem 1rem;
  border-radius: 6.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #fff;
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  max-width: 34.375rem;

  h1.ant-typography {
    color: white;
    font-size: 2.25rem; /* 36px */
    margin-bottom: 0.75rem; /* 12px */
    font-weight: 800;
  }

  div.ant-typography {
    color: #dae2ff;
    font-size: 0.9375rem; /* 15px */
    margin-bottom: 1.5rem; /* 24px */
  }
`;

export const StarIcon = styled(StarFilled)`
  color: #fbbf24;
`;

export const MascotWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40%;
  background: rgba(255, 255, 255, 0.1); /* Tạo khối màu sáng bên phải giống ảnh */
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 1024px) {
    display: none;
  }

  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    mix-blend-mode: multiply; /* Giúp hòa trộn nền trắng của ảnh vào nền của div */
    opacity: 0.9;
  }
`;

export const StyledButton = styled(Button)`
  height: 3rem;
  padding: 0 2rem;
  border-radius: 6.25rem;
  font-weight: 700;
  font-size: 0.9375rem;
  border: none;
  background: white;
  color: #2D447F;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f0f7ff !important;
    color: #2D447F !important;
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;
