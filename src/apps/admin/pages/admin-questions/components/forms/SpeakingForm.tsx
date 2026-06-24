import React, { useState } from 'react';
import { Form, Input, Select, Space, Row, Col, Button, Card, Tag, Typography, Steps, Upload, Divider } from 'antd';
import {
    AudioOutlined,
    SaveOutlined,
    CameraOutlined,
    PictureOutlined,
    SolutionOutlined,
    FlagOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    UserOutlined,
    TeamOutlined,
    BulbOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../../constants';

const { TextArea } = Input;
const { Text } = Typography;

interface SpeakingFormProps {
    form: any;
    part: string;
    onSubmit: () => void;
}

const SpeakingForm: React.FC<SpeakingFormProps> = ({ form, part, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const watchedPart = Form.useWatch('part', form);

    // Sync prop part to form if store is empty
    React.useEffect(() => {
        if (part && !form.getFieldValue('part')) {
            form.setFieldsValue({ part });
        }
    }, [part, form]);

    const activePart = watchedPart || part;

    const isPart1 = activePart === 'part1';
    const isPart2 = activePart === 'part2';
    const isPart3 = activePart === 'part3';
    const isPart4 = activePart === 'part4';

    // Initialize fields when part changes
    React.useEffect(() => {
        const values = form.getFieldsValue();
        if (isPart1 && (!values.p1Questions || values.p1Questions.length !== 3)) {
            form.setFieldsValue({ p1Questions: Array(3).fill('') });
        }
    }, [activePart, form, isPart1]);

    const next = async () => {
        try {
            await form.validateFields(currentStep === 0 ? ['title', 'part', 'tags'] : []);
            setCurrentStep(currentStep + 1);
        } catch (error) { console.log(error); }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const renderPart1 = () => (
        <Card className="premium-card" title={<Space><AudioOutlined /> Part 1: Personal Information (3 Câu hỏi phản xạ)</Space>}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Hỏi về thông tin cá nhân, sở thích, đời sống (30s mỗi câu). Hãy nhập 3 câu hỏi cùng chủ đề.
            </Text>
            <Form.List name="p1Questions">
                {(fields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Form.Item {...restField} name={name} label={`Câu hỏi Phản xạ #${name + 1}`} rules={[{ required: true }]} key={key}>
                                <Input placeholder="Ví dụ: What do you usually do in your free time?" prefix={<UserOutlined style={{ color: '#94a3b8' }} />} />
                            </Form.Item>
                        ))}
                    </div>
                )}
            </Form.List>
        </Card>
    );

    const renderPart2 = () => (
        <Card className="premium-card" title={<Space><CameraOutlined /> Part 2: Describe & Opinion (Mô tả tranh)</Space>}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name="p2Image" label="Bức tranh Part 2" rules={[{ required: true }]}>
                        <Upload.Dragger multiple={false} listType="picture-card" style={{ background: '#f8fafc', borderRadius: '12px' }}>
                            <p className="ant-upload-drag-icon"><PictureOutlined /></p>
                            <p className="ant-upload-text">Tải ảnh tranh</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item name="p2ImageDesc" label="Mô tả tranh (Cho AI)">
                        <TextArea rows={2} placeholder="Mô tả nội dung bức tranh để làm dữ liệu..." />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Form.Item name="p2Q1" label="Câu 1: Describe this picture (Mô tả)" initialValue="Describe this picture." rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="p2Q2" label="Câu 2: Personal Experience (Trải nghiệm)" rules={[{ required: true }]} tooltip="Kể về trải nghiệm cá nhân liên quan đến tranh">
                            <Input placeholder="Tell me about a time when you did a similar activity..." />
                        </Form.Item>
                        <Form.Item name="p2Q3" label="Câu 3: Social Opinion (Quan điểm)" rules={[{ required: true }]} tooltip="Câu hỏi mở rộng về tầm quan trọng/xu hướng">
                            <Input placeholder="Why do you think it is important to...?" />
                        </Form.Item>
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    const renderPart3 = () => (
        <Card className="premium-card" title={<Space><TeamOutlined /> Part 3: Compare & Contrast (So sánh 2 tranh)</Space>}>
            <Row gutter={24} style={{ marginBottom: '24px' }}>
                <Col span={12}>
                    <Form.Item name="p3ImageA" label="Bức tranh A (Trái)" rules={[{ required: true }]}>
                        <Upload.Dragger listType="picture-card" style={{ background: '#f8fafc', borderRadius: '12px' }}>
                            <PictureOutlined /> <div>Tranh A</div>
                        </Upload.Dragger>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="p3ImageB" label="Bức tranh B (Phải)" rules={[{ required: true }]}>
                        <Upload.Dragger listType="picture-card" style={{ background: '#f8fafc', borderRadius: '12px' }}>
                            <PictureOutlined /> <div>Tranh B</div>
                        </Upload.Dragger>
                    </Form.Item>
                </Col>
            </Row>
            <Divider orientation={"left" as any} plain><Text type="secondary">Câu hỏi (45s mỗi câu)</Text></Divider>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Form.Item name="p3Q1" label="Câu 1: Comparison (So sánh 2 tranh)" initialValue="Tell me, what can you see in the two pictures?" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="p3Q2" label="Câu 2: Pros/Cons (Ưu - Nhược điểm)" rules={[{ required: true }]}>
                    <Input placeholder="What are the advantages of...?" />
                </Form.Item>
                <Form.Item name="p3Q3" label="Câu 3: Preference (Lựa chọn cá nhân)" rules={[{ required: true }]}>
                    <Input placeholder="Which of these would you prefer and why?" />
                </Form.Item>
            </Space>
        </Card>
    );

    const renderPart4 = () => (
        <Card className="premium-card" title={<Space><BulbOutlined /> Part 4: Abstract Topic (Thảo luận trừu tượng)</Space>}>
            <Row gutter={24}>
                <Col span={6}>
                    <Form.Item name="p4Image" label="Ảnh gợi ý (Tùy chọn)">
                        <Upload.Dragger listType="picture-card" style={{ background: '#f8fafc', borderRadius: '12px' }}>
                            <PictureOutlined /> <div>Ảnh gợi ý</div>
                        </Upload.Dragger>
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                        <Text strong style={{ color: '#92400e' }}>Lưu ý: </Text>
                        <Text style={{ color: '#92400e' }}>Thí sinh có 1 phút chuẩn bị và 2 phút nói liên tục cho cả 3 câu dưới đây.</Text>
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Form.Item name="p4Q1" label="Câu 1: Story/Feeling (Kể chuyện/Cảm xúc)" rules={[{ required: true }]}>
                            <Input placeholder="Tell me about a time when you felt..." />
                        </Form.Item>
                        <Form.Item name="p4Q2" label="Câu 2: Importance (Tầm quan trọng)" rules={[{ required: true }]}>
                            <Input placeholder="How do you think we can...?" />
                        </Form.Item>
                        <Form.Item name="p4Q3" label="Câu 3: Solution/Future (Giải pháp/Tương lai)" rules={[{ required: true }]}>
                            <Input placeholder="What are some possible ways to...?" />
                        </Form.Item>
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    const steps = [
        {
            title: 'Thông tin chung',
            icon: <FlagOutlined />,
            content: (
                <Card className="premium-card">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="title" label="Tiêu đề đề thi Speaking" rules={[{ required: true }]}>
                                <Input placeholder="Ví dụ: Speaking Test - Social Life & Hobbies" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Phần thi" name="part" initialValue={part}>
                                <Select>
                                    <Select.Option value="part1">Part 1: Personal Information</Select.Option>
                                    <Select.Option value="part2">Part 2: Describe & Opinion</Select.Option>
                                    <Select.Option value="part3">Part 3: Compare & Contrast</Select.Option>
                                    <Select.Option value="part4">Part 4: Abstract Topic</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Tags" name="tags">
                                <Select mode="tags" placeholder="Ví dụ: Daily Life, B1..." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            )
        },
        {
            title: 'Thiết lập câu hỏi',
            icon: <AudioOutlined />,
            content: (
                <div style={{ minHeight: '400px' }}>
                    <Form.Item noStyle shouldUpdate={(prevVal, curVal) => prevVal.part !== curVal.part}>
                        {({ getFieldValue }) => {
                            const p = getFieldValue('part') || part;
                            if (p === 'part1') return renderPart1();
                            if (p === 'part2') return renderPart2();
                            if (p === 'part3') return renderPart3();
                            if (p === 'part4') return renderPart4();
                            return renderPart1();
                        }}
                    </Form.Item>
                </div>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '32px', padding: '0 50px' }}>
                <Steps current={currentStep} items={steps.map(s => ({ title: s.title, icon: s.icon }))} />
            </div>

            <div className="animate-fade-in" style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
                {steps[currentStep].content}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                {currentStep > 0 && <Button onClick={prev} icon={<ArrowLeftOutlined />} size="large">Quay lại</Button>}
                {currentStep < steps.length - 1 ? (
                    <Button type="primary" onClick={next} size="large">Tiếp theo <ArrowRightOutlined /></Button>
                ) : (
                    <Button type="primary" onClick={onSubmit} icon={<SaveOutlined />} size="large" style={{ background: ADMIN_COLORS.primary, borderColor: ADMIN_COLORS.primary }}>
                        Lưu bộ đề Speaking
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SpeakingForm;
