import React, { useState } from 'react';
import { Card, List, Button, Typography, Row, Col, Space, Tag, Input, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { FE_SKILL_TO_ID, IBankQuestion } from '../services/types';

const { Text } = Typography;

interface Props {
    skill: string;
    targetPart: string;
    bankQuestions: IBankQuestion[];
    selectedQuestions: IBankQuestion[];
    handleAddQuestion: (record: IBankQuestion) => void;
    handleRemoveQuestion: (key: string) => void;
    handleAddAll: (questions: IBankQuestion[]) => void;
}

const partNumberOf = (part: string) => Number((part || 'Part 1').replace(/\D/g, '')) || 1;

const PartPracticeSelection: React.FC<Props> = ({
    skill,
    targetPart,
    bankQuestions,
    selectedQuestions,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddAll,
}) => {
    const [searchText, setSearchText] = useState('');

    const skillId = FE_SKILL_TO_ID[skill];
    const partNumber = partNumberOf(targetPart);

    const bankForPart = bankQuestions.filter((q) => q.skillId === skillId && q.partNumber === partNumber);
    const selectedForPart = selectedQuestions.filter((q) => q.skillId === skillId && q.partNumber === partNumber);
    const selectedKeys = new Set(selectedForPart.map((q) => q.key));

    const filteredBank = bankForPart.filter(
        (q) => searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Row gutter={16}>
            {/* Bank */}
            <Col xs={24} lg={12}>
                <Card
                    title={<Space><Text strong>Ngân hàng câu hỏi {targetPart}</Text><Tag>{bankForPart.length} câu</Tag></Space>}
                    bordered={false}
                    extra={
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm câu hỏi..."
                            size="small"
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 180 }}
                        />
                    }
                >
                    <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                        <List
                            size="small"
                            dataSource={filteredBank}
                            locale={{ emptyText: <Empty description="Không có câu hỏi cho phần này" /> }}
                            renderItem={(record: IBankQuestion) => {
                                const added = selectedKeys.has(record.key);
                                return (
                                    <List.Item
                                        style={{ background: '#fff', border: '1px solid #f1f5f9', marginBottom: '6px', borderRadius: '6px', padding: '8px 12px' }}
                                        actions={[
                                            <Button
                                                key="add"
                                                size="small"
                                                type={added ? 'default' : 'text'}
                                                disabled={added}
                                                style={{ color: added ? '#94a3b8' : ADMIN_COLORS.primary }}
                                                icon={<PlusOutlined />}
                                                onClick={() => handleAddQuestion(record)}
                                            >
                                                {added ? 'Đã thêm' : ''}
                                            </Button>,
                                        ]}
                                    >
                                        <Text style={{ fontSize: '13px' }} ellipsis={{ tooltip: record.content }}>{record.content}</Text>
                                    </List.Item>
                                );
                            }}
                        />
                    </div>
                </Card>
            </Col>

            {/* Đã cấu hình */}
            <Col xs={24} lg={12}>
                <Card
                    title={<Space><Text strong>Câu hỏi đã cấu hình</Text><Tag color="success">{selectedForPart.length}</Tag></Space>}
                    bordered={false}
                >
                    <div style={{ maxHeight: '460px', overflowY: 'auto' }}>
                        <List
                            size="small"
                            dataSource={selectedForPart}
                            locale={{ emptyText: <Empty description="Chưa chọn câu nào — bấm + để thêm" /> }}
                            renderItem={(record: IBankQuestion, index: number) => (
                                <List.Item
                                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '6px', borderRadius: '6px', padding: '8px 12px' }}
                                    actions={[
                                        <Button
                                            key="del"
                                            size="small"
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveQuestion(record.key)}
                                        />,
                                    ]}
                                >
                                    <Space>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>{index + 1}.</Text>
                                        <Text style={{ fontSize: '13px' }} ellipsis={{ tooltip: record.content }}>{record.content}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </div>

                    {/* Nút "+" cấu hình thêm: thêm tất cả câu hỏi của phần */}
                    <Button
                        type="dashed"
                        block
                        icon={<AppstoreAddOutlined />}
                        onClick={() => handleAddAll(bankForPart)}
                        style={{ marginTop: '12px', height: '44px', color: ADMIN_COLORS.primary, borderColor: ADMIN_COLORS.primary }}
                    >
                        Thêm tất cả câu hỏi của phần này ({bankForPart.length})
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default PartPracticeSelection;
