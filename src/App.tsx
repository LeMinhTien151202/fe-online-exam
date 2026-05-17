import React from 'react';
import HomePage from './apps/home/pages/Index';
import { ConfigProvider } from 'antd';
import { antThemeConfig } from './configs/antDesign';
import { QueryProvider } from './shared/providers/QueryProvider';

/**
 * Root Component của ứng dụng
 */
function App() {
  return (
    <QueryProvider>
      <ConfigProvider theme={antThemeConfig}>
        <HomePage />
      </ConfigProvider>
    </QueryProvider>
  );
}

export default App;

