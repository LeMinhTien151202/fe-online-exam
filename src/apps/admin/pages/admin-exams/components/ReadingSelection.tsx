import React, { useState } from 'react';
import { Card, List, Button, Typography, Row, Col, Space, Tag, Collapse, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { IBankQuestion } from '../services/types';

const { Text } = Typography;
const { Panel } = Collapse;

interface Props {
    selectedQuestions: IBankQuestion[];
    handleAddQuestion: (record: IBankQuestion) => void;
    handleRemoveQuestion: (key: string) => void;
    mode?: 'partial' | 'set' | 'full';
    targetPart?: string;
    bankQuestions?: IBankQuestion[];
}

const ReadingSelection: React.FC<Props> = ({
    selectedQuestions,
    handleAddQuestion,
    handleRemoveQuestion,
    mode = 'set',
    targetPart = 'Part 1',
    bankQuestions = []
}) => {
    const [searchText, setSearchText] = useState('');
    const displayParts = mode === 'partial' ? [targetPart] : ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Part 5'];


    return (
        <Row gutter={16}>
            {/* Left Bank */}
            <Col xs={24} lg={12}>
                <Card
                    title={`Ngân hàng Reading ${mode === 'partial' ? targetPart : ''}`}
                    bordered={false}
                    extra={
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm bài đọc..."
                            size="small"
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 180 }}
                        />
                    }
                >
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {displayParts.map(p => {
                            const partQuestions = bankQuestions.filter((q: IBankQuestion) =>
                                q.type === 'Reading' &&
                                q.part === p &&
                                (searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase()))
                            );

                            return (
                                <Collapse defaultActiveKey={['bank']} ghost style={{ marginBottom: '16px' }} key={p}>
                                    <Panel
                                        header={<Space><Text strong>{p}</Text><Tag>{partQuestions.length} bài</Tag></Space>}
                                        key="bank"
                                        style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    >
                                        <List
                                            size="small"
                                            pagination={{ pageSize: 6, size: 'small', simple: true }}
                                            dataSource={partQuestions}
                                            renderItem={(record: IBankQuestion) => (


                                                <List.Item
                                                    style={{ background: '#fff', border: '1px solid #f1f5f9', marginBottom: '8px', borderRadius: '4px' }}
                                                    actions={[
                                                        <Button
                                                            size="small"
                                                            type="text"
                                                            style={{ color: ADMIN_COLORS.primary }}
                                                            icon={<PlusOutlined />}
                                                            onClick={() => handleAddQuestion(record)}
                                                        />
                                                    ]}
                                                >
                                                    <Space direction="vertical" size={0}>
                                                        <Text style={{ fontSize: '13px', fontWeight: 500 }}>{record.content}</Text>
                                                    </Space>

                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            );
                        })}
                    </div>
                </Card>
            </Col>

            {/* Right Slots */}
            <Col xs={24} lg={12}>
                <Card title={mode === 'partial' ? `Cấu hình ${targetPart}` : "Cấu trúc đề Reading chuẩn (5 Parts)"} bordered={false}>

                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {displayParts.map(p => {
                            const selectedInPart = selectedQuestions.find(q => q && q.part === p && q.type === 'Reading');

                            return (
                                <div key={p} style={{ marginBottom: '1.5rem', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <Text strong style={{ color: ADMIN_COLORS.primary }}>{p}</Text>
                                        {selectedInPart ? <Tag color="success">Đã chọn</Tag> : <Tag color="warning">Trống</Tag>}
                                    </div>

                                    {selectedInPart ? (
                                        <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Space direction="vertical" size={2}>
                                                <Text strong>{selectedInPart.content}</Text>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>ID: {selectedInPart.key}</Text>
                                            </Space>
                                            <Button
                                                size="small"
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveQuestion(selectedInPart.key)}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ padding: '20px', border: '2px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
                                            <Text type="secondary" italic>Chọn câu hỏi cho {p} từ ngân hàng</Text>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default ReadingSelection;
