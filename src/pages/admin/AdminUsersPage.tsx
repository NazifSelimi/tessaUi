'use client';

import { useState, useEffect } from 'react';
import { Typography, Table, Tag, Select, Input, Space, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getUsers, updateUserRole } from '@/api/client';
import type { User, UserRole } from '@/types';

const { Title, Text } = Typography;

const roleColors: Record<UserRole, string> = {
  guest: 'default',
  user: 'blue',
  stylist: 'purple',
  distributor: 'gold',
  admin: 'red',
};

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'stylist', label: 'Stylist' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    message.success('User role updated');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: unknown, record: User) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole, record: User) => (
        <Select
          value={role}
          onChange={(val) => handleRoleChange(record.id, val)}
          style={{ width: 120 }}
          size="small"
        >
          {roleOptions.filter(o => o.value !== 'all').map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              <Tag color={roleColors[opt.value as UserRole]}>{opt.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Users</Title>
          <Text type="secondary">{users.length} registered users</Text>
        </div>
        <Space>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            options={roleOptions}
            style={{ width: 130 }}
          />
        </Space>
      </div>

      <Card>
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
