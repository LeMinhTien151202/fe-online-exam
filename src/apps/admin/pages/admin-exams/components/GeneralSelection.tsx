import React from 'react';
import { Card, Table, Button, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { IBankQuestion } from '../services/types';

interface Props {
    filteredQuestions: IBankQuestion[];
    selectedQuestions: IBankQuestion[];
    handleAddQuestion: (record: IBankQuestion) => void;
    handleRemoveQuestion: (key: string) => void;
}

const GeneralSelection: React.FC<Props> = ({
    filteredQuestions,
    selectedQuestions,
    handleAddQuestion,
    handleRemoveQuestion,
}) => {
    return (
        <Row gutter={16}>
            <Col xs={24} lg={12}>
                <Card title="Ngân hàng câu hỏi" bordered={false}>
                    <Table
                        dataSource={filteredQuestions}
                        size="small"
                        pagination={{ pageSize: 8 }}
                        columns={[
                            { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
                            {
                                title: 'Thêm',
                                key: 'action',
                                width: 60,
                                render: (record: IBankQuestion) => (
                                    <Button size="small" type="text" style={{ color: '#1890ff' }} icon={<PlusOutlined />} onClick={() => handleAddQuestion(record)} />

                                ),
                            },
                        ]}
                    />
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Câu hỏi đã chọn" bordered={false}>
                    <Table
                        dataSource={selectedQuestions}
                        size="small"
                        pagination={{ pageSize: 8 }}
                        columns={[
                            { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
                            {
                                title: 'Xóa',
                                key: 'action',
                                width: 60,
                                render: (record: IBankQuestion) => (
                                    <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveQuestion(record.key)} />
                                ),
                            },
                        ]}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default GeneralSelection;
