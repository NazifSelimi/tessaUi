'use client';

import { useState, useEffect } from 'react';
import { Typography, Table, Tag, Select, Input, Space, Card, Button, Modal, message, Descriptions } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { getStylistRequests, reviewStylistRequest } from '@/api/client';
import type { StylistRequest, StylistRequestStatus } from '@/types';

const { Title, Text } = Typography;

const statusColors: Record<StylistRequestStatus, string> = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
};

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminStylistRequestsPage() {
  const [requests, setRequests] = useState<StylistRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<StylistRequest | null>(null);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      const data = await getStylistRequests();
      setRequests(data);
      setLoading(false);
    }
    loadRequests();
  }, []);

  const handleReview = async (requestId: string, action: 'approve' | 'reject') => {
    await reviewStylistRequest(requestId, action, 'admin@tessa.com');
    setRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', reviewedAt: new Date().toISOString() } 
        : r
    ));
    message.success(`Request ${action === 'approve' ? 'approved' : 'rejected'}`);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(search.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const columns = [
    {
      title: 'Applicant',
      key: 'applicant',
      render: (_: unknown, record: StylistRequest) => (
        <div>
          <Text strong>{record.userName}</Text>
          <br />
          <Text type="secondary">{record.userEmail}</Text>
        </div>
      ),
    },
    {
      title: 'Salon',
      dataIndex: 'salonName',
      key: 'salon',
      render: (name: string) => name || '-',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp: string) => exp || '-',
    },
    {
      title: 'Referral Code',
      dataIndex: 'referralCode',
      key: 'referralCode',
      render: (code: string) => code ? <Tag>{code}</Tag> : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: StylistRequestStatus) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: StylistRequest) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => setSelectedRequest(record)}>
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="text" 
                icon={<CheckOutlined />} 
                style={{ color: '#52c41a' }}
                onClick={() => handleReview(record.id, 'approve')}
              >
                Approve
              </Button>
              <Button 
                type="text" 
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReview(record.id, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Stylist Requests</Title>
          <Text type="secondary">
            {requests.length} total requests
            {pendingCount > 0 && <Tag color="orange" style={{ marginLeft: 8 }}>{pendingCount} pending</Tag>}
          </Text>
        </div>
        <Space>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ width: 130 }}
          />
        </Space>
      </div>

      <Card>
        <Table
          dataSource={filteredRequests}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Application Details"
        open={!!selectedRequest}
        onCancel={() => setSelectedRequest(null)}
        footer={selectedRequest?.status === 'pending' ? [
          <Button key="reject" danger onClick={() => handleReview(selectedRequest.id, 'reject')}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleReview(selectedRequest.id, 'approve')}>
            Approve
          </Button>,
        ] : null}
        width={500}
      >
        {selectedRequest && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{selectedRequest.userName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedRequest.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Salon Name">{selectedRequest.salonName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Salon Address">{selectedRequest.salonAddress || '-'}</Descriptions.Item>
            <Descriptions.Item label="Experience">{selectedRequest.experience || '-'}</Descriptions.Item>
            <Descriptions.Item label="Referral Code">{selectedRequest.referralCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedRequest.status]}>{selectedRequest.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Submitted">
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </Descriptions.Item>
            {selectedRequest.reviewedAt && (
              <Descriptions.Item label="Reviewed">
                {new Date(selectedRequest.reviewedAt).toLocaleString()}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
