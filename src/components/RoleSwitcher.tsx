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
        <button 
          onClick={() => setMinimized(false)}
          className="role-switcher"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Open dev role switcher"
        >
          <BugOutlined style={{ color: '#fff', fontSize: 18 }} />
        </button>
      </Tooltip>
    );
  }

  return (
    <div className="role-switcher" role="region" aria-label="Development role switcher">
      {/* Header */}
      <div className="role-switcher__header">
        <Space size={6}>
          <BugOutlined style={{ color: 'var(--color-text-secondary)' }} />
          <Text className="role-switcher__title">DEV MODE</Text>
        </Space>
        <button 
          onClick={() => setMinimized(true)}
          style={{ 
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Minimize role switcher"
        >
          <CloseOutlined style={{ fontSize: 12, color: 'var(--color-text-muted)' }} />
        </button>
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
          aria-label="Select development role"
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
          background: 'var(--color-background-alt)', 
          padding: '8px 10px', 
          borderRadius: 'var(--radius-md)',
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
          color: 'var(--color-text-muted)',
        }}
      >
        This widget is only visible in development mode.
      </Text>
    </div>
  );
}
