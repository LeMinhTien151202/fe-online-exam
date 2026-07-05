import {
ArrowLeftOutlined,
ArrowRightOutlined,
BookOutlined,
CheckCircleOutlined,
FlagOutlined,
FontSizeOutlined,
KeyOutlined,
SaveOutlined
} from '@ant-design/icons';
import { Button,Card,Col,Divider,Form,Input,Radio,Row,Select,Space,Steps,Tag,Typography } from 'antd';
import React,{ useState } from 'react';
import { ADMIN_COLORS } from '../../../../constants';

const { TextArea } = Input;
const { Text } = Typography;

interface GrammarFormProps {
    form: any;
    part: string;
    onSubmit: () => void;
}

const GrammarForm: React.FC<GrammarFormProps> = ({ form, part, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const watchedPart = Form.useWatch('part', form);
    const watchedVocabPool = Form.useWatch('vocabPool', form);

    // Sync prop part to form if store is empty
    React.useEffect(() => {
        if (part && !form.getFieldValue('part')) {
            form.setFieldsValue({ part });
        }
    }, [part, form]);

    const activePart = watchedPart || part;

    const isGrammar = activePart === 'grammar';
    const isVocab = activePart?.startsWith('vocab_');

    // Initialize fields when part changes
    React.useEffect(() => {
        const values = form.getFieldsValue();
        if (isGrammar && (!values.gramQuestions || values.gramQuestions.length !== 25)) {
            // Aptis Grammar often has 25 questions, but we can allow flexible count or default to 25
            form.setFieldsValue({ gramQuestions: Array(25).fill({ optA: '', optB: '', optC: '', answer: 'A' }) });
        } else if (isVocab) {
            if (!values.vocabPool || values.vocabPool.length !== 10) {
                form.setFieldsValue({ vocabPool: Array(10).fill('') });
            }
            if (!values.vocabQuestions || values.vocabQuestions.length !== 5) {
                form.setFieldsValue({ vocabQuestions: Array(5).fill({ question: '', answerIndex: null }) });
            }
        }
    }, [activePart, form, isGrammar, isVocab]);

    const next = async () => {
        try {
            await form.validateFields(currentStep === 0 ? ['title', 'part', 'tags'] : []);
            setCurrentStep(currentStep + 1);
        } catch (error) { console.log(error); }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const renderGrammar = () => (
        <Card className="premium-card" title={<Space><FontSizeOutlined /> Grammatical Knowledge (25 Câu trắc nghiệm)</Space>}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Hệ thống 25 câu hỏi trắc nghiệm A, B, C đi từ dễ (A1) đến khó (C).
            </Text>
            <Form.List name="gramQuestions">
                {(fields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item {...restField} name={[name, 'content']} label={<Tag color="blue">Câu hỏi #{name + 1}</Tag>} rules={[{ required: true }]}>
                                            <Input placeholder="Ví dụ: She ____ to the cinema yesterday." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item {...restField} name={[name, 'optA']} label="A" rules={[{ required: true }]}><Input /></Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item {...restField} name={[name, 'optB']} label="B" rules={[{ required: true }]}><Input /></Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item {...restField} name={[name, 'optC']} label="C" rules={[{ required: true }]}><Input /></Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item {...restField} name={[name, 'answer']} label="Đáp án" rules={[{ required: true }]}>
                                            <Radio.Group buttonStyle="solid">
                                                <Radio.Button value="A">A</Radio.Button>
                                                <Radio.Button value="B">B</Radio.Button>
                                                <Radio.Button value="C">C</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>
                )}
            </Form.List>
        </Card>
    );

    const renderVocabulary = () => {
        const getVocabLabel = () => {
            switch (activePart) {
                case 'vocab_task1': return 'Word Definition (Tìm nghĩa của từ)';
                case 'vocab_task2': return 'Word Collocation (Từ hay đi cùng nhau)';
                case 'vocab_task3': return 'Word Use (Điền từ vào câu)';
                case 'vocab_task4': return 'Synonym Matching (Từ đồng nghĩa)';
                case 'vocab_task5': return 'Antonym Matching (Từ trái nghĩa)';
                default: return 'Matching Task';
            }
        };

        const getQuestionLabel = () => {
            switch (activePart) {
                case 'vocab_task1': return 'Định nghĩa / Khái niệm';
                case 'vocab_task2': return 'Từ gốc (Prefix)';
                case 'vocab_task3': return 'Câu văn chứa chỗ trống';
                case 'vocab_task4': return 'Từ cần tìm đồng nghĩa';
                case 'vocab_task5': return 'Từ cần tìm trái nghĩa';
                default: return 'Câu hỏi';
            }
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Card className="premium-card" title={<Space><KeyOutlined /> {getVocabLabel()}</Space>}>
                    <Divider orientation={"left" as any}><Text type="secondary">Ngân hàng 10 từ vựng cho Task này</Text></Divider>
                    <Form.List name="vocabPool">
                        {(fields) => (
                            <Row gutter={[8, 8]}>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Col span={4.8} key={key} style={{ width: '20%' }}>
                                        <Form.Item {...restField} name={name} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                                            <Input placeholder={`Từ #${name + 1}`} prefix={<Tag style={{ margin: 0 }}>{name + 1}</Tag>} />
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Form.List>
                </Card>

                <Card className="premium-card" title={<Space><BookOutlined /> 5 Câu hỏi Matching</Space>}>
                    <Form.List name="vocabQuestions">
                        {(fields) => (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={16} key={key} align="middle">
                                        <Col span={18}>
                                            <Form.Item {...restField} name={[name, 'question']} label={`${getQuestionLabel()} #${name + 1}`} rules={[{ required: true }]}>
                                                <Input placeholder={`Nhập nội dung cho câu #${name + 1}...`} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item {...restField} name={[name, 'answerIndex']} label="Từ đúng (trong pool)" rules={[{ required: true }]}>
                                                <Select placeholder="Chọn từ đúng">
                                                    {watchedVocabPool?.map((word: string, idx: number) => (
                                                        <Select.Option key={idx} value={idx}>
                                                            <Tag color="cyan">#{idx + 1}</Tag> {word || `Từ #${idx + 1}`}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                        )}
                    </Form.List>
                </Card>
            </div>
        );
    };

    const steps = [
        {
            title: 'Thông tin chung',
            icon: <FlagOutlined />,
            content: (
                <Card className="premium-card">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="title" label="Tiêu đề đề thi Grammar & Vocabulary" rules={[{ required: true }]}>
                                <Input placeholder="Ví dụ: Placement Test - Grammar & Vocabulary" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Phần thi" name="part" initialValue={part}>
                                <Select>
                                    <Select.OptGroup label="Grammar">
                                        <Select.Option value="grammar">Grammatical Knowledge (25 Qs)</Select.Option>
                                    </Select.OptGroup>
                                    <Select.OptGroup label="Vocabulary (Matching)">
                                        <Select.Option value="vocab_task1">Task 1: Word Definition</Select.Option>
                                        <Select.Option value="vocab_task2">Task 2: Word Collocation</Select.Option>
                                        <Select.Option value="vocab_task3">Task 3: Word Use</Select.Option>
                                        <Select.Option value="vocab_task4">Task 4: Synonym Matching</Select.Option>
                                        <Select.Option value="vocab_task5">Task 5: Antonym Matching</Select.Option>
                                    </Select.OptGroup>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Tags" name="tags">
                                <Select mode="tags" placeholder="Ví dụ: Core, Placement..." />
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
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.part !== cur.part}>
                        {({ getFieldValue }) => {
                            const p = getFieldValue('part') || part;
                            if (p === 'grammar') return renderGrammar();
                            if (p?.startsWith('vocab_')) return renderVocabulary();
                            return renderGrammar();
                        }}
                    </Form.Item>
                </div>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '32px', padding: '0 40px' }}>
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
                        Lưu bộ đề
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GrammarForm;
