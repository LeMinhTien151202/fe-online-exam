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

const GrammarSelection: React.FC<Props> = ({
    selectedQuestions,
    handleAddQuestion,
    handleRemoveQuestion,
    mode = 'set',
    targetPart = 'Part 1',
    bankQuestions = []
}) => {
    const [searchText, setSearchText] = useState('');
    const showGrammar = mode !== 'partial' || targetPart === 'Part 1';
    const showVocab = mode !== 'partial' || targetPart === 'Part 2';

    return (
        <Row gutter={16}>
            {/* Left Bank */}
            <Col xs={24} lg={12}>
                <Card
                    title={`Ngân hàng Grammar & Vocab ${mode === 'partial' ? targetPart : ''}`}
                    bordered={false}
                    extra={
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Tìm câu hỏi..."
                            size="small"
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 180 }}
                        />
                    }
                >
                    <div style={{ maxHeight: '640px', overflowY: 'auto' }}>
                        <Collapse accordion defaultActiveKey={[showGrammar ? 'Grammar' : 'Task 1']} ghost expandIconPosition="end">
                            {/* Grammar Section */}
                            {showGrammar && (
                                <Panel
                                    header={<Space><Text strong>PHẦN 1: GRAMMAR</Text></Space>}
                                    key="Grammar"
                                    style={{ background: '#f0f9ff', marginBottom: '8px', borderRadius: '4px', border: '1px solid #bae6fd' }}
                                >
                                    <List
                                        size="small"
                                        pagination={{ pageSize: 10, size: 'small', simple: true }}
                                        dataSource={bankQuestions.filter((q: IBankQuestion) => q.type === 'Grammar' && (searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase())))}
                                        renderItem={(record: IBankQuestion) => (
                                            <List.Item
                                                style={{ background: '#fff', marginBottom: '4px', borderRadius: '4px', padding: '8px 12px', border: '1px solid #f1f5f9' }}
                                                actions={[<Button size="small" type="text" style={{ color: ADMIN_COLORS.primary }} icon={<PlusOutlined />} onClick={() => handleAddQuestion(record)} />]}
                                            >
                                                <Text style={{ fontSize: '12px' }} ellipsis>{record.content}</Text>
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            )}

                            {/* Vocab Sections */}
                            {showVocab && ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'].map(t => {
                                const vocabQs = bankQuestions.filter((q: IBankQuestion) => q.type === 'Vocabulary' && q.task === t && (searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase())));
                                return (
                                    <Panel
                                        key={t}
                                        header={<Space><Text strong>PHẦN 2: VOCAB - {t}</Text><Tag style={{ fontSize: '10px' }}>{vocabQs.length} bài</Tag></Space>}
                                        style={{ background: '#f8fafc', marginBottom: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                    >
                                        <List
                                            size="small"
                                            pagination={{ pageSize: 6, size: 'small', simple: true }}
                                            dataSource={vocabQs}

                                            renderItem={(record: IBankQuestion) => (
                                                <List.Item
                                                    style={{ background: '#fff', marginBottom: '4px', borderRadius: '4px', padding: '8px 12px', border: '1px solid #f1f5f9' }}
                                                    actions={[<Button size="small" type="text" style={{ color: ADMIN_COLORS.primary }} icon={<PlusOutlined />} onClick={() => handleAddQuestion(record)} />]}
                                                >
                                                    <Text style={{ fontSize: '12px' }} ellipsis>{record.content}</Text>
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

            {/* Right Structure */}
            <Col xs={24} lg={12}>
                <Card title={mode === 'partial' ? `Cấu hình ${targetPart}` : "Cấu trúc đề Grammar & Vocab"} bordered={false}>
                    <div style={{ maxHeight: '640px', overflowY: 'auto', paddingRight: '4px' }}>
                        {/* Grammar slots */}
                        {showGrammar && (
                            <div style={{ marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ background: '#f8fafc', padding: '10px 15px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong>1. NGỮ PHÁP (25 CÂU)</Text>
                                    <Tag color="blue">{selectedQuestions.filter(q => q && q.part === 'Part 1').length}/25</Tag>
                                </div>
                                <List
                                    size="small"
                                    rowKey="id"
                                    dataSource={Array.from({ length: 25 }).map((_, i) => ({ id: i, data: selectedQuestions.filter(q => q && q.part === 'Part 1')[i] || null }))}
                                    renderItem={(slot: { id: number; data: IBankQuestion | null }) => {
                                        const item = slot.data;
                                        const idx = slot.id;
                                        return (
                                            <List.Item style={{ padding: '6px 15px' }} actions={item ? [<Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveQuestion(item.key)} />] : []}>
                                                <Space><Text type="secondary" style={{ width: 22 }}>{idx + 1}</Text>{item ? <Text ellipsis style={{ fontSize: '12px' }}>{item.content}</Text> : <Text type="secondary" italic style={{ fontSize: '11px', opacity: 0.6 }}>- Trống -</Text>}</Space>
                                            </List.Item>
                                        );
                                    }}
                                />
                            </div>
                        )}
                        {/* Vocab slots */}
                        {showVocab && ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'].map(t => {
                            const taskQs = selectedQuestions.filter(q => q && (q.part === 'Part 2' || q.type === 'Vocabulary') && q.task === t);

                            return (
                                <div key={t} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                                    <div style={{ background: '#f8fafc', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                                        <Text strong style={{ color: ADMIN_COLORS.primary }}>{t}</Text>
                                        <Text type={taskQs.length === 5 ? 'success' : 'warning'} style={{ fontSize: '11px' }}>{taskQs.length}/5</Text>
                                    </div>
                                    <List
                                        size="small"
                                        rowKey="id"
                                        dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i, data: taskQs[i] || null }))}
                                        renderItem={(slot: { id: number; data: IBankQuestion | null }) => {
                                            const item = slot.data;
                                            const idx = slot.id;
                                            return (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 15px', background: item ? '#fff' : '#fafafa' }}>
                                                    <Space><Text type="secondary" style={{ fontSize: '10px' }}>S{idx + 1}:</Text>{item ? <Text ellipsis style={{ fontSize: '11px', maxWidth: '180px' }}>{item.content}</Text> : <Text type="secondary" italic style={{ fontSize: '10px', opacity: 0.5 }}>Trống</Text>}</Space>
                                                    {item && <Button size="small" type="text" danger icon={<DeleteOutlined style={{ fontSize: '10px' }} />} onClick={() => handleRemoveQuestion(item.key)} />}
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default GrammarSelection;
