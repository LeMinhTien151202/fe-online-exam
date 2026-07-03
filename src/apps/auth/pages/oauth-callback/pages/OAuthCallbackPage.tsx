import React from 'react';
import { Spin } from 'antd';
import { useOAuthCallback } from '../hook/useOAuthCallback';
import * as S from '../styles/oauthCallback.styled';

const OAuthCallbackPage: React.FC = () => {
  useOAuthCallback();

  return (
    <S.CenterWrapper>
      <Spin size="large" tip="Đang xử lý đăng nhập..." />
    </S.CenterWrapper>
  );
};

export default OAuthCallbackPage;
