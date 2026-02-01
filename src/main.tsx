import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppProvider } from '@/store/AppContext';
import App from './App';
import './index.css';

const theme = {
  token: {
    colorPrimary: '#1a1a1a',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#fafafa',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <AppProvider>
          <App />
        </AppProvider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
