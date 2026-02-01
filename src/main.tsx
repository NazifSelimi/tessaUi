/**
 * Tessa Shop - Main Entry Point
 * 
 * React 19 + Vite + Redux Toolkit + Ant Design
 * A modern ecommerce platform for professional hair care products
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { store, persistor } from '@/store';
import App from './App';
import './index.css';

/**
 * Ant Design Theme Configuration
 * 
 * Modern, premium aesthetic with clean typography
 * and subtle color accents
 */
const theme = {
  token: {
    // Brand Colors
    colorPrimary: '#1a1a1a',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    
    // Background Colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#fafafa',
    colorBgElevated: '#ffffff',
    
    // Border & Shadow
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    
    // Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    
    // Layout
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      fontWeight: 500,
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#374151',
      headerSplitColor: '#e5e7eb',
    },
    Menu: {
      itemBg: 'transparent',
      activeBarBorderWidth: 0,
    },
    Input: {
      activeBorderColor: '#1a1a1a',
      hoverBorderColor: '#6b7280',
    },
    Select: {
      activeBorderColor: '#1a1a1a',
    },
    Form: {
      labelFontSize: 14,
      labelColor: '#374151',
    },
    Drawer: {
      paddingLG: 24,
    },
    Modal: {
      paddingLG: 24,
    },
    Tag: {
      defaultBg: '#f3f4f6',
      defaultColor: '#374151',
    },
    Badge: {
      colorBgContainer: '#ef4444',
    },
  },
};

/**
 * Loading fallback for PersistGate
 */
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: '#fafafa',
  }}>
    <Spin size="large" />
  </div>
);

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <BrowserRouter>
          <ConfigProvider theme={theme}>
            <AntApp>
              <App />
            </AntApp>
          </ConfigProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
