import React, { useState } from 'react';
import { Card, List, Button, Typography, Row, Col, Space, Tag, Collapse, Input, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, AudioOutlined, PictureOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { IBankQuestion } from '../services/types';

const { Text } = Typography;
const { Panel } = Collapse;

interface Props {
    selectedQuestions: any[];
    handleAddQuestion: (record: any) => void;
    handleRemoveQuestion: (key: string) => void;
    mode?: 'partial' | 'set' | 'full';
    targetPart?: string;
    bankQuestions?: IBankQuestion[];
}

const SpeakingSelection: React.FC<Props> = ({
    selectedQuestions,
    handleAddQuestion,
    handleRemoveQuestion,
    mode = 'set',
    targetPart = 'Part 1',
    bankQuestions = []
}) => {
    const [searchText, setSearchText] = useState('');
    const displayParts = mode === 'partial' ? [targetPart] : ['Part 1', 'Part 2', 'Part 3', 'Part 4'];

    return (
        <Row gutter={16}>
            {/* Left Bank */}
            <Col xs={24} lg={12}>
                <Card
                    title={`Ngân hàng Speaking ${mode === 'partial' ? targetPart : ''}`}
                    bordered={false}
                    extra={
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm chủ đề..."
                            size="small"
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 180 }}
                        />
                    }
                >
                    <div style={{ maxHeight: '640px', overflowY: 'auto' }}>
                        <Collapse accordion defaultActiveKey={[displayParts[0]]} ghost expandIconPosition="end">
                            {displayParts.map(p => {
                                const partQuestions = bankQuestions.filter((q: any) =>
                                    q.type === 'Speaking' &&
                                    q.part === p &&
                                    (searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase()))
                                );

                                return (
                                    <Panel
                                        header={
                                            <Space>
                                                <Text strong>{p}: {
                                                    p === 'Part 1' ? 'Personal Info' :
                                                        p === 'Part 2' ? 'Photo Description' :
                                                            p === 'Part 3' ? 'Compare Two Photos' : 'Abstract Topic'
                                                }</Text>
                                                <Tag style={{ fontSize: '10px' }}>{partQuestions.length} task</Tag>
                                            </Space>
                                        }
                                        key={p}
                                        style={{ background: '#f8fafc', marginBottom: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                    >
                                        <List
                                            size="small"
                                            pagination={{ pageSize: 6, size: 'small', simple: true }}
                                            dataSource={partQuestions}

                                            renderItem={(record: any) => (
                                                <List.Item
                                                    style={{ background: '#fff', border: '1px solid #f1f5f9', marginBottom: '4px', borderRadius: '4px', padding: '10px 15px' }}
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
                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{mode === 'partial' ? `Cấu hình ${targetPart}` : 'Cấu trúc Speaking trọn bộ'}</span>
                        </div>
                    }
                    bordered={false}
                >
                    <div style={{ maxHeight: '640px', overflowY: 'auto', paddingRight: '4px' }}>
                        {displayParts.map(p => {
                            const selectedTask = selectedQuestions.find(q => q && q.part === p);


                            return (
                                <div key={p} style={{ marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Space>
                                            <div style={{ background: ADMIN_COLORS.primary, color: '#fff', width: 24, height: 24, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                {p.split(' ')[1]}
                                            </div>
                                            <Text strong>{p}</Text>
                                        </Space>
                                        <Tag color={selectedTask ? 'success' : 'default'}>
                                            {selectedTask ? 'Đã chọn' : 'Trống'}
                                        </Tag>
                                    </div>
                                    <div style={{ padding: '16px', background: '#fff' }}>
                                        {selectedTask ? (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ fontSize: '14px' }}>{selectedTask.content}</Text>
                                                <Button
                                                    size="small"
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleRemoveQuestion(selectedTask.key)}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center' }}>
                                                <Text type="secondary" italic style={{ fontSize: '12px' }}>Chưa có câu hỏi cho {p}</Text>
                                            </div>
                                        )}
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

export default SpeakingSelection;
