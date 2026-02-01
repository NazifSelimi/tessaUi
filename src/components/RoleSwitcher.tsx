/**
 * Role Switcher Component (DEV ONLY)
 * 
 * Floating widget for switching user roles during development.
 * Only visible in development environment.
 * 
 * Note: In production, role changes should only happen through
 * proper authentication and authorization flows.
 */

import { Select, Typography, Space, Tag, Tooltip } from 'antd';
import { BugOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '@/contexts';
import type { UserRole } from '@/types';

const { Text } = Typography;

// Only show in development
const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';

const roleOptions: { value: UserRole; label: string; color: string; description: string }[] = [
  { 
    value: 'guest', 
    label: 'Guest', 
    color: 'default',
    description: 'Not logged in - sees retail prices only',
  },
  { 
    value: 'user', 
    label: 'User', 
    color: 'blue',
    description: 'Registered customer - sees retail prices',
  },
  { 
    value: 'stylist', 
    label: 'Stylist', 
    color: 'purple',
    description: 'Professional stylist - sees stylist pricing',
  },
  { 
    value: 'distributor', 
    label: 'Distributor', 
    color: 'gold',
    description: 'Product distributor - sees all prices, can generate codes',
  },
  { 
    value: 'admin', 
    label: 'Admin', 
    color: 'red',
    description: 'Full access to admin dashboard',
  },
];

export default function RoleSwitcher() {
  const { currentRole, setDevRole, devRoleOverride, user } = useAuth();
  const [minimized, setMinimized] = useState(false);

  // Don't render in production
  if (!isDevelopment) {
    return null;
  }

  // Get current role info
  const currentRoleInfo = roleOptions.find(r => r.value === currentRole);

  if (minimized) {
    return (
      <Tooltip title="Dev Role Switcher - Click to expand">
        <div 
          onClick={() => setMinimized(false)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <BugOutlined style={{ color: '#fff', fontSize: 18 }} />
        </div>
      </Tooltip>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
      padding: 16,
      minWidth: 220,
      border: '1px solid #f0f0f0',
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <Space size={6}>
          <BugOutlined style={{ color: '#6b7280' }} />
          <Text strong style={{ fontSize: 12, color: '#6b7280' }}>DEV MODE</Text>
        </Space>
        <CloseOutlined 
          onClick={() => setMinimized(true)}
          style={{ 
            fontSize: 12, 
            color: '#9ca3af', 
            cursor: 'pointer',
            padding: 4,
          }} 
        />
      </div>

      {/* Role Selector */}
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>Switch Role</Text>
        <Select
          value={currentRole}
          onChange={setDevRole}
          style={{ width: '100%' }}
          size="small"
          optionLabelProp="label"
        >
          {roleOptions.map(option => (
            <Select.Option 
              key={option.value} 
              value={option.value}
              label={
                <Space>
                  <Tag color={option.color} style={{ margin: 0 }}>{option.label}</Tag>
                </Space>
              }
            >
              <div>
                <Tag color={option.color}>{option.label}</Tag>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
                  {option.description}
                </Text>
              </div>
            </Select.Option>
          ))}
        </Select>

        {/* Current Status */}
        <div style={{ 
          background: '#fafafa', 
          padding: '8px 10px', 
          borderRadius: 6,
          fontSize: 11,
        }}>
          {user ? (
            <>
              <Text type="secondary">Logged in as: </Text>
              <Text strong>{user.name}</Text>
              {devRoleOverride && (
                <div style={{ marginTop: 4 }}>
                  <Text type="warning">Role overridden from {user.role}</Text>
                </div>
              )}
            </>
          ) : (
            <Text type="secondary">Not logged in</Text>
          )}
        </div>
      </Space>

      {/* Info */}
      <Text 
        type="secondary" 
        style={{ 
          fontSize: 10, 
          display: 'block', 
          marginTop: 8,
          color: '#9ca3af',
        }}
      >
        This widget is only visible in development mode.
      </Text>
    </div>
  );
}
