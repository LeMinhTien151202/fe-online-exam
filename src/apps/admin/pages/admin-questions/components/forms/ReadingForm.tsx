import React, { useState } from 'react';
import { Form, Input, Select, Space, Divider, Row, Col, Button, Typography, Card, Tag, Steps, Radio } from 'antd';
import {
    FileTextOutlined,
    CheckCircleOutlined,
    FlagOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    SortAscendingOutlined,
    AppstoreOutlined,
    EditOutlined
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../../constants';

const { TextArea } = Input;
const { Text: AntText } = Typography;

interface ReadingFormProps {
    form: any;
    part: string;
    onSubmit: () => void;
}

const ReadingForm: React.FC<ReadingFormProps> = ({ form, part, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [activePart, setActivePart] = useState(part);

    const watchedPart = Form.useWatch('part', form);
    const watchedPassage = Form.useWatch('passage', form);
    const watchedPeople = Form.useWatch('people', form);
    const watchedHeadings = Form.useWatch('headings', form);

    React.useEffect(() => {
        if (watchedPart && watchedPart !== activePart) setActivePart(watchedPart);
    }, [watchedPart, activePart]);

    const isPart1 = activePart === 'part1';
    const isPart2 = activePart === 'part2';
    const isPart3 = activePart === 'part3';
    const isPart4 = activePart === 'part4';

    React.useEffect(() => {
        if (!activePart) return;
        const values = form.getFieldsValue();
        if (isPart1 && (!values.gaps || values.gaps.length !== 5)) {
            form.setFieldsValue({ gaps: Array(5).fill({}) });
        } else if (isPart2 && (!values.sets || values.sets.length !== 2)) {
            form.setFieldsValue({
                sets: [
                    { sentences: Array(6).fill({}).map((_, i) => ({ id: i })) },
                    { sentences: Array(6).fill({}).map((_, i) => ({ id: i })) }
                ]
            });
        } else if (isPart3 && (!values.people || values.people.length !== 4)) {
            form.setFieldsValue({
                people: Array(4).fill({}),
                questions: Array(7).fill({})
            });
        } else if (isPart4 && (!values.paragraphs || values.paragraphs.length !== 7)) {
            form.setFieldsValue({
                paragraphs: Array(7).fill({}),
                headings: Array(8).fill({})
            });
        }
    }, [activePart, form, isPart1, isPart2, isPart3, isPart4]);

    const next = async () => {
        try {
            await form.validateFields(currentStep === 0 ? ['title', 'part'] : []);
            setCurrentStep(currentStep + 1);
        } catch (error) { console.log(error); }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    // PART 1: 1 đoạn văn/email chứa 5 chỗ trống ___(1)..(5) + 5 bộ đáp án
    const renderPart1 = () => (
        <div className="animate-fade-in">
            <Divider orientation={"left" as any}><Space><FileTextOutlined /> NỘI DUNG ĐOẠN VĂN / EMAIL</Space></Divider>
            <Card size="small" className="premium-card" style={{ marginBottom: '20px' }}>
                <Form.Item
                    name="passage"
                    label="Đoạn văn (chèn ___(1) đến ___(5) tại đúng vị trí 5 chỗ trống)"
                    rules={[{ required: true, message: 'Nhập nội dung đoạn văn có chỗ trống' }]}
                    style={{ marginBottom: 0 }}
                >
                    <TextArea
                        rows={6}
                        placeholder="Ví dụ: Hi Anna, thanks for your ___(1). I would ___(2) to join the trip. Please let me ___(3) the details. See ___(4) soon. Best ___(5), Tom."
                    />
                </Form.Item>
            </Card>

            <Divider orientation={"left" as any}><Space><EditOutlined /> ĐÁP ÁN CHO 5 CHỖ TRỐNG (mỗi chỗ 3 lựa chọn)</Space></Divider>
            <Form.List name="gaps">
                {(fields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card key={key} size="small" className="premium-card" title={<Tag color="blue">Chỗ trống ({name + 1})</Tag>}>
                                <Row gutter={16} align="bottom">
                                    <Col span={7}>
                                        <Form.Item {...restField} name={[name, 'optA']} label="Lựa chọn A" rules={[{ required: true }]} style={{ marginBottom: 0 }}><Input /></Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item {...restField} name={[name, 'optB']} label="Lựa chọn B" rules={[{ required: true }]} style={{ marginBottom: 0 }}><Input /></Form.Item>
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item {...restField} name={[name, 'optC']} label="Lựa chọn C" rules={[{ required: true }]} style={{ marginBottom: 0 }}><Input /></Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item {...restField} name={[name, 'answer']} label="Đúng" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                                            <Radio.Group buttonStyle="solid" size="small">
                                                <Radio.Button value="A">A</Radio.Button><Radio.Button value="B">B</Radio.Button><Radio.Button value="C">C</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                )}
            </Form.List>
        </div>
    );

    // PART 2: Sentence Reordering
    const renderPart2 = () => (
        <div className="animate-fade-in">
            <Divider orientation={"left" as any}><Space><SortAscendingOutlined /> SẮP XẾP THỨ TỰ (2 BÀI TẬP)</Space></Divider>
            <Form.List name="sets">
                {(setFields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {setFields.map((setField) => (
                            <Card key={setField.key} className="premium-card" title={`Bài tập #${setField.name + 1}`}>
                                <Form.List name={[setField.name, 'sentences']}>
                                    {(fields) => (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <div key={key} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                    <Tag style={{ marginTop: 5, width: 70, textAlign: 'center' }} color={name === 0 ? 'gold' : 'blue'}>
                                                        {name === 0 ? 'MỞ ĐẦU' : `Câu ${name + 1}`}
                                                    </Tag>
                                                    <Form.Item {...restField} name={[name, 'text']} rules={[{ required: true }]} style={{ flex: 1, marginBottom: 0 }}>
                                                        <Input placeholder={name === 0 ? "Câu mở đầu cố định..." : "Nhập nội dung câu..."} />
                                                    </Form.Item>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Form.List>
                            </Card>
                        ))}
                    </div>
                )}
            </Form.List>
        </div>
    );

    // PART 3: Opinion Matching (Who said what?)
    const renderPart3 = () => (
        <div className="animate-fade-in">
            <Divider orientation={"left" as any}><Space><FileTextOutlined /> THIẾT LẬP 4 NGƯỜI PHÁT BIỂU</Space></Divider>
            <Form.List name="people">
                {(fields) => (
                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Col span={12} key={key}>
                                {watchedPassage && (
                                    <Card size="small" title="Đoạn văn tham chiếu" className="mb-4" style={{ background: '#f8fafc' }}>
                                        <AntText italic>{watchedPassage}</AntText>
                                    </Card>
                                )}
                                <Card size="small" title={`Người #${name + 1}`} className="premium-card">
                                    <Form.Item {...restField} name={[name, 'name']} label="Tên người" rules={[{ required: true }]}>
                                        <Input placeholder="Ví dụ: Boyd, Emilia..." />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'content']} label="Nội dung phát biểu" rules={[{ required: true }]}>
                                        <TextArea rows={4} placeholder="Nhập nội dung quan điểm..." />
                                    </Form.Item>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Form.List>

            <Divider orientation={"left" as any}><Space><CheckCircleOutlined /> 7 CÂU HỎI KHỚP Ý KIẾN</Space></Divider>
            <Form.List name="questions">
                {(fields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card key={key} size="small" className="premium-card">
                                <Row gutter={16} align="middle">
                                    <Col span={18}>
                                        <Form.Item {...restField} name={[name, 'text']} label={`Câu hỏi #${name + 1}`} rules={[{ required: true }]}>
                                            <Input placeholder="Ví dụ: Who thinks volunteering is a good way to make friends?" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item {...restField} name={[name, 'answerIndex']} label="Người phát biểu" rules={[{ required: true }]}>
                                            <Select placeholder="Chọn người">
                                                {watchedPeople?.map((p: any, idx: number) => (
                                                    <Select.Option key={idx} value={idx}>{p.name || `Người #${idx + 1}`}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                )}
            </Form.List>
        </div>
    );

    // PART 4: Heading Matching
    const renderPart4 = () => (
        <div className="animate-fade-in">
            <Divider orientation={"left" as any}><Space><FileTextOutlined /> DANH SÁCH 8 TIÊU ĐỀ (HEADINGS)</Space></Divider>
            <Card style={{ marginBottom: '24px' }}>
                <Form.List name="headings">
                    {(fields) => (
                        <Row gutter={[8, 8]}>
                            {fields.map(({ key, name, ...restField }) => (
                                <Col span={12} key={key}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <Tag>#{name + 1}</Tag>
                                        <Form.Item {...restField} name={[name, 'text']} rules={[{ required: true }]} style={{ flex: 1, marginBottom: 0 }}>
                                            <Input placeholder="Nhập tiêu đề..." />
                                        </Form.Item>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Form.List>
            </Card>
            <Divider orientation={"left" as any}><Space><FileTextOutlined /> NỘI DUNG 7 ĐOẠN VĂN (A-G)</Space></Divider>
            <Form.List name="paragraphs">
                {(fields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card key={key} size="small" title={`Đoạn văn ${String.fromCharCode(65 + name)}`} className="premium-card">
                                <Form.Item {...restField} name={[name, 'content']} label="Nội dung đoạn văn" rules={[{ required: true }]}>
                                    <TextArea rows={3} placeholder="Nhập nội dung đoạn văn..." />
                                </Form.Item>
                                <Form.Item {...restField} name={[name, 'headingIndex']} label="Tiêu đề phù hợp" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                                    <Select placeholder="Chọn tiêu đề phù hợp">
                                        {watchedHeadings?.map((h: any, idx: number) => (
                                            <Select.Option key={idx} value={idx}>Heading #{idx + 1}: {h.text || '...'}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>
                        ))}
                    </div>
                )}
            </Form.List>
        </div>
    );

    const steps = [
        {
            title: 'Nội dung chung',
            icon: <FileTextOutlined />,
            content: (
                <Row gutter={24}>
                    <Col span={24}>
                        <Card className="premium-card" title={<Space><FlagOutlined /> Cấu hình bài thi</Space>}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="title" label="Tiêu đề bài đọc" rules={[{ required: true }]}><Input placeholder="Nhập tiêu đề..." /></Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Phần thi" name="part" initialValue={part}>
                                        <Select>
                                            <Select.Option value="part1">Part 1: Sentence Comprehension</Select.Option>
                                            <Select.Option value="part2">Part 2: Text Cohesion</Select.Option>
                                            <Select.Option value="part3">Part 3: Short Text</Select.Option>
                                            <Select.Option value="part4">Part 4: Long Text</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Tags" name="tags"><Select mode="tags" /></Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            title: 'Thiết lập câu hỏi',
            icon: <CheckCircleOutlined />,
            content: (
                <div style={{ minHeight: '400px' }}>
                    {isPart1 && renderPart1()}
                    {isPart2 && renderPart2()}
                    {isPart3 && renderPart3()}
                    {isPart4 && renderPart4()}
                </div>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '32px', padding: '0 50px' }}>
                <Steps current={currentStep} items={steps.map(s => ({ title: s.title, icon: s.icon }))} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
                {steps[currentStep].content}
            </div>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                {currentStep > 0 && <Button onClick={prev} icon={<ArrowLeftOutlined />} size="large">Quay lại</Button>}
                {currentStep < steps.length - 1 ? (
                    <Button type="primary" onClick={next} size="large">Tiếp theo <ArrowRightOutlined /></Button>
                ) : (
                    <Button type="primary" onClick={onSubmit} icon={<SaveOutlined />} size="large" style={{ background: ADMIN_COLORS.primary, borderColor: ADMIN_COLORS.primary }}>Lưu câu hỏi</Button>
                )}
            </div>
        </div>
    );
};

export default ReadingForm;
