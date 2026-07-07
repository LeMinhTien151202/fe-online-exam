import {
ArrowLeftOutlined,
ArrowRightOutlined,
CheckCircleOutlined,
EditOutlined,
FlagOutlined,
MailOutlined,
MessageOutlined,
NotificationOutlined,
OrderedListOutlined,
SaveOutlined,
UserOutlined
} from '@ant-design/icons';
import { Button,Card,Col,Form,Input,Row,Select,Space,Steps,Typography } from 'antd';
import type { FormInstance } from 'antd';
import React,{ useState } from 'react';
import { ADMIN_COLORS } from '../../../../constants';

const { TextArea } = Input;
const { Text } = Typography;

interface WritingFormProps {
    form: FormInstance;
    part: string;
    onSubmit: () => void;
}

const WritingForm: React.FC<WritingFormProps> = ({ form, part, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const watchedPart = Form.useWatch('part', form);

    // Sync prop part to form if changed
    React.useEffect(() => {
        if (part && !form.getFieldValue('part')) {
            form.setFieldsValue({ part });
        }
    }, [part, form]);

    const activePart = watchedPart || part;

    const isPart1 = activePart === 'part1';
    const isPart3 = activePart === 'part3';

    // Initialize fields when part changes
    React.useEffect(() => {
        const values = form.getFieldsValue();
        if (isPart1 && (!values.p1Questions || values.p1Questions.length !== 5)) {
            form.setFieldsValue({ p1Questions: Array.from({ length: 5 }, () => ({ question: '', sample: '' })) });
        } else if (isPart3 && (!values.p3MemberQuestions || values.p3MemberQuestions.length !== 3)) {
            form.setFieldsValue({
                p3MemberQuestions: [
                    { member: 'Member A', question: '', sample: '' },
                    { member: 'Member B', question: '', sample: '' },
                    { member: 'Member C', question: '', sample: '' }
                ]
            });
        }
    }, [activePart, form, isPart1, isPart3]);

    const next = async () => {
        try {
            await form.validateFields(currentStep === 0 ? ['title', 'part', 'tags'] : []);
            setCurrentStep(currentStep + 1);
        } catch (error) { console.log(error); }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const renderPart1 = () => (
        <Card className="premium-card" title={<Space><OrderedListOutlined /> Part 1: Word-level Writing (5 Câu hỏi ngắn)</Space>}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Yêu cầu thí sinh điền từ hoặc cụm từ ngắn (1-5 từ). Hãy nhập 5 câu hỏi mở đơn giản.
            </Text>
            <Form.List name="p1Questions">
                {(fields) => (
                    <Row gutter={[16, 0]}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Col span={24} key={key}>
                                <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                                    <Form.Item {...restField} name={[name, 'question']} label={`Câu hỏi #${name + 1}`} rules={[{ required: true, message: 'Nhập câu hỏi' }]} style={{ marginBottom: 8 }}>
                                        <Input placeholder="Ví dụ: What is your favorite time of the year?" />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'sample']} label="Đáp án mẫu (tuỳ chọn)" style={{ marginBottom: 0 }}>
                                        <Input placeholder="Ví dụ: autumn" />
                                    </Form.Item>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Form.List>
        </Card>
    );

    const renderPart2 = () => (
        <Card className="premium-card" title={<Space><EditOutlined /> Part 2: Short Text Writing (Đoạn văn ngắn)</Space>}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Yêu cầu thí sinh viết đoạn văn từ 20-30 từ. Hãy nhập đề bài cụ thể.
            </Text>
            <Form.Item name="p2Prompt" label="Đề bài Part 2" rules={[{ required: true }]}>
                <TextArea rows={5} placeholder="Ví dụ: Please write about your interests and why you want to join our Travel Club." />
            </Form.Item>
            <Form.Item name="p2Sample" label="Đáp án mẫu (tuỳ chọn)">
                <TextArea rows={4} placeholder="Nhập bài mẫu tham khảo (20-30 từ)..." />
            </Form.Item>
        </Card>
    );

    const renderPart3 = () => (
        <Card className="premium-card" title={<Space><MessageOutlined /> Part 3: Social Media Chat Room</Space>}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Nhập 3 câu hỏi từ 3 thành viên khác nhau. Thí sinh sẽ trả lời mỗi câu 30-40 từ.
            </Text>
            <Form.List name="p3MemberQuestions">
                {(fields) => (
                    <Row gutter={[20, 20]}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Col span={24} key={key}>
                                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Space align="baseline" style={{ display: 'flex', marginBottom: '8px' }}>
                                        <UserOutlined />
                                        <Form.Item {...restField} name={[name, 'member']} style={{ marginBottom: 0 }}>
                                            <Input disabled style={{ width: '120px', fontWeight: 'bold' }} />
                                        </Form.Item>
                                    </Space>
                                    <Form.Item {...restField} name={[name, 'question']} label="Câu hỏi thảo luận" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
                                        <TextArea autoSize={{ minRows: 2 }} placeholder="Nhập câu hỏi từ thành viên này..." />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'sample']} label="Đáp án mẫu (tuỳ chọn)" style={{ marginBottom: 0 }}>
                                        <TextArea autoSize={{ minRows: 2 }} placeholder="Nhập câu trả lời mẫu (30-40 từ)..." />
                                    </Form.Item>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Form.List>
        </Card>
    );

    const renderPart4 = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card className="premium-card" title={<Space><NotificationOutlined /> Part 4: Context - Thông báo (Notice)</Space>}>
                <Form.Item name="p4Notice" label="Nội dung thông báo gây bất lợi/thay đổi" rules={[{ required: true }]}>
                    <TextArea rows={6} placeholder="Ví dụ: We are sorry to inform you that the upcoming field trip has been cancelled due to..." />
                </Form.Item>
            </Card>

            <Row gutter={24}>
                <Col span={12}>
                    <Card className="premium-card" title={<Space><MailOutlined /> Task 1: Email cho bạn bè</Space>}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Informal (50-75 từ).</Text>
                        <Form.Item name="p4InformalPrompt" label="Yêu cầu cụ thể cho Task 1" rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="Ví dụ: Write an email to your friend..." />
                        </Form.Item>
                        <Form.Item name="p4InformalSample" label="Bài mẫu (tuỳ chọn)">
                            <TextArea rows={4} placeholder="Nhập bài email thân mật mẫu (50-75 từ)..." />
                        </Form.Item>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card className="premium-card" title={<Space><MailOutlined /> Task 2: Email trang trọng</Space>}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Formal (120-150 từ).</Text>
                        <Form.Item name="p4FormalPrompt" label="Yêu cầu cụ thể cho Task 2" rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="Ví dụ: Write an email to the club manager..." />
                        </Form.Item>
                        <Form.Item name="p4FormalSample" label="Bài mẫu (tuỳ chọn)">
                            <TextArea rows={4} placeholder="Nhập bài email trang trọng mẫu (120-150 từ)..." />
                        </Form.Item>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    const steps = [
        {
            title: 'Thông tin chung',
            icon: <FlagOutlined />,
            content: (
                <Card className="premium-card">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="title" label="Tiêu đề đề thi Writing" rules={[{ required: true }]}>
                                <Input placeholder="Ví dụ: Writing Practice Test - Travel Club" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Phần thi" name="part" initialValue={part}>
                                <Select>
                                    <Select.Option value="part1">Part 1: Word-level Writing</Select.Option>
                                    <Select.Option value="part2">Part 2: Short Text Writing</Select.Option>
                                    <Select.Option value="part3">Part 3: Social Media Chat</Select.Option>
                                    <Select.Option value="part4">Part 4: Contextual Emails</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Tags" name="tags">
                                <Select mode="tags" placeholder="Ví dụ: A1, B2..." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            )
        },
        {
            title: 'Thiết lập câu hỏi',
            icon: <CheckCircleOutlined />,
            content: (
                <div style={{ minHeight: '400px' }}>
                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.part !== currentValues.part}>
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
                        Lưu toàn bộ bài Writing
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WritingForm;
