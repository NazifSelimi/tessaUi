'use client';

import { Select, Typography, Space } from 'antd';
import { useApp } from '@/store/AppContext';
import type { UserRole } from '@/types';

const { Text } = Typography;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'guest', label: 'Guest' },
  { value: 'user', label: 'User' },
  { value: 'stylist', label: 'Stylist' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'admin', label: 'Admin' },
];

export default function RoleSwitcher() {
  const { currentRole, setRole } = useApp();

  return (
    <div className="role-switcher">
      <Space direction="vertical" size={4}>
        <Text type="secondary" style={{ fontSize: 11 }}>DEV: Switch Role</Text>
        <Select
          value={currentRole}
          onChange={setRole}
          options={roleOptions}
          style={{ width: 130 }}
          size="small"
        />
      </Space>
    </div>
  );
}
