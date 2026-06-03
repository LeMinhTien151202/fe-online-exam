import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const GaugeChartWrapper = styled.div`
  height: 120px;
  position: relative;
  display: flex;
  justify-content: center;
`;

export const GaugeValueText = styled.div`
  position: absolute;
  top: 65%;
  transform: translateY(-50%);
`;

export const ChartWrapper = styled.div`
  height: 320px;
`;
