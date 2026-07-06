import React from 'react';
import { Modal, Descriptions, Tag, Avatar, Space, Typography, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { IUserRow, ROLE_LABEL } from '../services/types';

const { Title, Text } = Typography;

interface UserDetailModalProps {
    open: boolean;
    onCancel: () => void;
    student: IUserRow | null;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, onCancel, student }) => {
    if (!student) return null;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <UserOutlined style={{ color: ADMIN_COLORS.primary }} />
                    <Title level={4} style={{ margin: 0 }}>Hồ sơ người dùng</Title>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" type="primary" onClick={onCancel} style={{ background: ADMIN_COLORS.primary, borderRadius: '6px' }}>
                    Đóng
                </Button>,
            ]}
            width={640}
            centered
        >
            <div style={{ paddingTop: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
                <Space align="center" style={{ marginBottom: '20px' }}>
                    <Avatar size={64} style={{ backgroundColor: ADMIN_COLORS.primary, fontSize: '24px' }}>
                        {student.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>{student.name}</Title>
                        <Text type="secondary" style={{ display: 'block' }}>{student.email}</Text>
                        <Space style={{ marginTop: '4px' }}>
                            <Tag color="blue">{ROLE_LABEL[student.role]}</Tag>
                            <Tag color="cyan">Mục tiêu: {student.target}</Tag>
                        </Space>
                    </div>
                </Space>

                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Mã người dùng">#{student.id}</Descriptions.Item>
                    <Descriptions.Item label="Họ và tên">{student.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
                    <Descriptions.Item label="Vai trò">{ROLE_LABEL[student.role]}</Descriptions.Item>
                    <Descriptions.Item label="Mục tiêu Aptis">{student.target}</Descriptions.Item>
                    <Descriptions.Item label="Chuỗi ngày (tạm tính)">🔥 {student.streak} ngày</Descriptions.Item>
                    <Descriptions.Item label="Ngày tham gia">{student.registeredDate}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={student.active ? 'success' : 'default'}>
                            {student.active ? 'Hoạt động' : 'Bị khóa'}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>

                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '16px' }}>
                    Tiến độ học và lịch sử thi sẽ hiển thị khi có API thống kê. "Chuỗi ngày" hiện đang tạm tính.
                </Text>
            </div>
        </Modal>
    );
};

export default UserDetailModal;
