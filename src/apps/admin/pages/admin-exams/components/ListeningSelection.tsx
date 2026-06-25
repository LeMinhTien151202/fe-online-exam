import React, { useState } from 'react';
import { Card, List, Button, Typography, Row, Col, Space, Tag, Collapse, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { mockBankQuestions } from '../services/mockData';

const { Text } = Typography;
const { Panel } = Collapse;

interface Props {
    selectedQuestions: any[];
    handleAddQuestion: (record: any) => void;
    handleRemoveQuestion: (key: string) => void;
    mode?: 'partial' | 'set' | 'full';
    targetPart?: string;
}

const ListeningSelection: React.FC<Props> = ({
    selectedQuestions,
    handleAddQuestion,
    handleRemoveQuestion,
    mode = 'set',
    targetPart = 'Part 1'
}) => {
    const [searchText, setSearchText] = useState('');
    const displayParts = mode === 'partial' ? [targetPart] : ['Part 1', 'Part 2', 'Part 3', 'Part 4'];

    return (
        <Row gutter={16}>
            {/* Left Bank */}
            <Col xs={24} lg={12}>
                <Card
                    title={`Ngân hàng Listening ${mode === 'partial' ? targetPart : ''}`}
                    bordered={false}
                    extra={
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm bài nghe..."
                            size="small"
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 180 }}
                        />
                    }
                >
                    <div style={{ maxHeight: '640px', overflowY: 'auto' }}>
                        <Collapse accordion defaultActiveKey={[displayParts[0]]} ghost expandIconPosition="end">
                            {displayParts.map(p => {
                                const partQuestions = mockBankQuestions.filter((q: any) =>
                                    q.type === 'Listening' &&
                                    q.part === p &&
                                    (searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase()))
                                );

                                return (
                                    <Panel
                                        header={<Space><Text strong>{p}</Text><Tag style={{ fontSize: '10px' }}>{partQuestions.length} file</Tag></Space>}
                                        key={p}
                                        style={{ background: '#f5f3ff', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ddd6fe' }}
                                    >
                                        <List
                                            size="small"
                                            pagination={{ pageSize: 6, size: 'small', simple: true }}
                                            dataSource={partQuestions}

                                            renderItem={(record: any) => (
                                                <List.Item
                                                    style={{ background: '#fff', border: '1px solid #e9d5ff', marginBottom: '4px', borderRadius: '4px', padding: '10px 15px' }}
                                                    actions={[
                                                        <Button
                                                            size="small"
                                                            type="text"
                                                            style={{ color: '#7c3aed' }}
                                                            icon={<PlusOutlined />}
                                                            onClick={() => handleAddQuestion(record)}
                                                        />
                                                    ]}
                                                >
                                                    <Text style={{ fontSize: '13px', fontWeight: 500 }}>{record.content}</Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    </div>
                </Card>
            </Col>

            {/* Right Slots */}
            <Col xs={24} lg={12}>
                <Card title={mode === 'partial' ? `Cấu hình ${targetPart}` : "Cấu trúc Listening chuẩn (4 Parts)"} bordered={false}>
                    <div style={{ maxHeight: '640px', overflowY: 'auto' }}>
                        {displayParts.map(p => {
                            const partQs = selectedQuestions.filter(q => q && q.part === p);

                            const totalSlots = p === 'Part 1' ? 13 : 4;

                            return (
                                <div key={p} style={{ marginBottom: '16px', border: '1px solid #ddd6fe', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div style={{ background: '#f5f3ff', padding: '12px 16px', borderBottom: '1px solid #ddd6fe', display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong style={{ color: '#5b21b6' }}>{p}</Text>
                                        <Text type={partQs.length === totalSlots ? 'success' : 'warning'} style={{ fontSize: '12px' }}>{partQs.length}/{totalSlots} slots</Text>
                                    </div>
                                    <div style={{ padding: '8px' }}>
                                        <List
                                            size="small"
                                            dataSource={Array.from({ length: totalSlots }).map((_, i) => partQs[i] || null)}
                                            renderItem={(item: any, idx: number) => (
                                                <div style={{ padding: '8px 12px', background: item ? '#fff' : '#fafafa', border: '1px solid #f3e8ff', marginBottom: '4px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Space>
                                                        <Text type="secondary" style={{ fontSize: '11px' }}>Slot {idx + 1}:</Text>
                                                        {item ? <Text style={{ fontSize: '13px' }}>{item.content}</Text> : <Text type="secondary" italic style={{ fontSize: '12px' }}>Trống</Text>}
                                                    </Space>
                                                    {item && <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveQuestion(item.key)} />}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default ListeningSelection;

