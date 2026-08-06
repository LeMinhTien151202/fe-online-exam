import styled from 'styled-components';

export const CenterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* width:100% + flex:1 để lấp đầy #root (là flex row) — nếu không sẽ co theo nội dung, lệch trái */
  width: 100%;
  flex: 1;
`;
