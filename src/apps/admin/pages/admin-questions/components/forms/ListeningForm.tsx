import {
ArrowLeftOutlined,
ArrowRightOutlined,
AudioOutlined,
CheckCircleOutlined,
DeleteOutlined,
FlagOutlined,
PlusOutlined,
QuestionCircleOutlined,
SaveOutlined,
SoundOutlined,
UploadOutlined,
UserOutlined
} from '@ant-design/icons';
import { Button,Card,Col,Divider,Form,Input,Radio,Row,Select,Space,Steps,Tag,Upload,message } from 'antd';
import React,{ useState } from 'react';
import { ADMIN_COLORS } from '../../../../constants';
import { questionApi } from '../../services/questionApi';

const { TextArea } = Input;

interface ListeningFormProps {
    form: any;
    part: string;
    onSubmit: () => void;
}

const ListeningForm: React.FC<ListeningFormProps> = ({ form, part, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [activePart, setActivePart] = useState(part);
    const [isUploading, setIsUploading] = useState(false);

    const watchedPart = Form.useWatch('part', form);
    const audioUrl = Form.useWatch('audioUrl', form);
    const watchedSpeakerAnswers = Form.useWatch('speakerAnswers', form);

    React.useEffect(() => {
        if (watchedPart && watchedPart !== activePart) {
            setActivePart(watchedPart);
        }
    }, [watchedPart, activePart]);

    const isPart1 = activePart === 'part1';
    const isPart2 = activePart === 'part2';
    const isPart3 = activePart === 'part3';
    const isPart4 = activePart === 'part4';

    const opinionPool = Form.useWatch('opinionPool', form);

    const handleUpload = async (options: any, folderType: 'images' | 'audio', formKey: string) => {
        const { file, onSuccess, onError } = options;
        try {
            setIsUploading(true);
            const res = await questionApi.upload(file as File, folderType);
            form.setFieldValue(formKey, res.url);
            onSuccess(res, file);
            message.success('Upload file thành công!');
        } catch (err: any) {
            onError(err);
            message.error(err.response?.data?.message || 'Upload file thất bại.');
        } finally {
            setIsUploading(false);
        }
    };

    // Re-initialize fields when part changes
    React.useEffect(() => {
        if (!activePart) return;
        const values = form.getFieldsValue();
        if (isPart1 && (!values.questions || values.questions.length !== 1)) {
            form.setFieldsValue({ questions: [{}] });
        } else if (isPart4 && (!values.questions || values.questions.length !== 2)) {
            form.setFieldsValue({ questions: [{}, {}] });
        } else if (isPart3 && (!values.opinions || values.opinions.length !== 4)) {
            form.setFieldsValue({ opinions: [{}, {}, {}, {}] });
        } else if (isPart2 && (!values.opinionPool || values.opinionPool.length !== 6)) {
            form.setFieldsValue({
                opinionPool: [{}, {}, {}, {}, {}, {}],
                speakerAnswers: [null, null, null, null]
            });
        }
    }, [activePart, form, isPart1, isPart2, isPart3, isPart4]);

    const next = async () => {
        try {
            await form.validateFields(currentStep === 0 ? ['audioUrl', 'transcript', 'tags', 'status'] : []);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    const renderMCQSection = (defaultCount: number, label: string) => (
        <div className="animate-fade-in">
            <Divider orientation={"left" as any}>
                <Space><QuestionCircleOutlined /> {label}</Space>
            </Divider>
            {isPart4 && (
                <Form.Item
                    name="content"
                    label="Đề bài chung (hiển thị 1 lần cho cả bài nghe)"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Ví dụ: Listen to the lecture and answer the questions." />
                </Form.Item>
            )}
            <Form.List name="questions">
                {(fields, { add, remove }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card
                                size="small"
                                key={key}
                                className="premium-card"
                                title={<Space><Tag color="blue">CÂU HỎI #{name + 1}</Tag></Space>}
                                extra={!isPart1 && fields.length > 1 && (
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                )}
                            >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'title']}
                                    label="Nội dung câu hỏi"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Nhập câu hỏi..." />
                                </Form.Item>

                                <Row gutter={16}>
                                    {['A', 'B', 'C'].map((letter) => (
                                        <Col span={8} key={letter}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, `opt${letter}`]}
                                                label={`Lựa chọn ${letter}`}
                                                rules={[{ required: true }]}
                                            >
                                                <Input placeholder={`Đáp án ${letter}`} />
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>

                                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'correctAnswer']}
                                        label={<strong>ĐÁP ÁN ĐÚNG</strong>}
                                        rules={[{ required: true }]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value="A">Đáp án A</Radio.Button>
                                            <Radio.Button value="B">Đáp án B</Radio.Button>
                                            <Radio.Button value="C">Đáp án C</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Card>
                        ))}
                        {!isPart1 && (
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: '45px' }}>
                                Thêm câu hỏi
                            </Button>
                        )}
                    </div>
                )}
            </Form.List>
        </div>
    );

    const renderPart2Matching = () => (
        <div className="animate-fade-in">
            <Divider orientation={"left" as any}>
                <Space><UserOutlined /> DANH SÁCH Ý KIẾN / NHẬN ĐỊNH (DANH SÁCH A-F)</Space>
            </Divider>
            <Form.List name="opinionPool">
                {(fields, { add, remove }) => (
                    <>
                        <Row gutter={[16, 16]}>
                            {fields.map(({ key, name, ...restField }) => (
                                <Col span={12} key={key}>
                                    <Card
                                        size="small"
                                        className="premium-card"
                                        title={<Space><Tag>Ý kiến {String.fromCharCode(65 + name)}</Tag></Space>}
                                        extra={fields.length > 4 && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />}
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'text']}
                                            rules={[{ required: true }]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <TextArea autoSize={{ minRows: 2 }} placeholder="Nhập nội dung ý kiến..." />
                                        </Form.Item>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        {fields.length < 6 && (
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: '16px' }}>
                                Thêm ý kiến vào Pool
                            </Button>
                        )}
                    </>
                )}
            </Form.List>

            <Divider orientation={"left" as any} style={{ marginTop: '32px' }}>
                <Space><CheckCircleOutlined /> ĐÁP ÁN CHO TỪNG SPEAKER (SPEAKER 1-4)</Space>
            </Divider>
            <Card className="premium-card-light">
                <Row gutter={24}>
                    {[1, 2, 3, 4].map(idx => (
                        <Col span={6} key={idx}>
                            <Form.Item name={['speakerAnswers', idx - 1]} label={<strong>Speaker {idx}</strong>} rules={[{ required: true }]}>
                                <Select placeholder="Chọn ý kiến" allowClear>
                                    {opinionPool?.map((op: any, i: number) => (
                                        <Select.Option key={i} value={i} disabled={watchedSpeakerAnswers?.includes(i)}>
                                            {op.text ? `(${String.fromCharCode(65 + i)}) ${op.text.substring(0, 30)}...` : `Ý kiến ${String.fromCharCode(65 + i)}`}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );

    const renderPart3Matching = () => (
        <div className="animate-fade-in">
            <Form.Item
                name="content"
                label="Đề bài chung (hiển thị 1 lần cho cả hội thoại)"
                rules={[{ required: true }]}
            >
                <Input placeholder="Ví dụ: Listen to the conversation. Who expresses each opinion?" />
            </Form.Item>
            <Divider orientation={"left" as any}>
                <Space><CheckCircleOutlined /> XÁC ĐỊNH QUAN ĐIỂM (4 NHẬN ĐỊNH)</Space>
            </Divider>
            <Form.List name="opinions">
                {(fields) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card
                                size="small"
                                key={key}
                                className="premium-card"
                                title={<Space><Tag color="purple">Nhận định #{name + 1}</Tag></Space>}
                            >
                                <Row gutter={24} align="middle">
                                    <Col span={14}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'text']}
                                            label="Nội dung nhận định"
                                            rules={[{ required: true }]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Input placeholder="Nhập nhận định mà Speaker đưa ra..." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <div style={{ background: '#fdf2f8', padding: '12px', borderRadius: '8px', border: '1px solid #fce7f3' }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'answer']}
                                                label={<strong>ĐÁP ÁN</strong>}
                                                rules={[{ required: true }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Radio.Group buttonStyle="solid" size="small">
                                                    <Radio.Button value="man">Man</Radio.Button>
                                                    <Radio.Button value="woman">Woman</Radio.Button>
                                                    <Radio.Button value="both">Both</Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                )}
            </Form.List>
        </div>
    );

    const steps = [
        {
            title: 'Chuẩn bị tư liệu',
            icon: <SoundOutlined />,
            content: (
                <Row gutter={24}>
                    <Col span={16}>
                        <Card className="premium-card" title={<Space><SoundOutlined /> Nguồn âm thanh & Script</Space>}>
                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item name="audioUrl" label="Link file Audio" rules={[{ required: true }]}>
                                        <Input prefix={<AudioOutlined />} placeholder="https://storage.com/audio.mp3" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Hoặc tải lên">
                                        <Upload
                                            customRequest={(opts) => handleUpload(opts, 'audio', 'audioUrl')}
                                            showUploadList={false}
                                            accept="audio/*"
                                        >
                                            <Button icon={<UploadOutlined />} loading={isUploading} block>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                {audioUrl && (
                                    <Col span={24} style={{ marginBottom: '16px' }}>
                                        <audio src={audioUrl} controls style={{ width: '100%' }} />
                                    </Col>
                                )}
                                <Col span={24}>
                                    <Form.Item name="transcript" label="Nội dung Script (Lời thoại)" rules={[{ required: true }]}>
                                        <TextArea rows={8} placeholder="Nhập transcript chi tiết..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="premium-card" title={<Space><FlagOutlined /> Thông tin chung</Space>}>
                            <Form.Item label="Kỹ năng">
                                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>LISTENING</Tag>
                            </Form.Item>
                            <Form.Item label="Phần thi (Part)" name="part" initialValue={part}>
                                <Select>
                                    <Select.Option value="part1">Part 1: Information Recognition</Select.Option>
                                    <Select.Option value="part2">Part 2: Information Matching</Select.Option>
                                    <Select.Option value="part3">Part 3: Opinion Matching</Select.Option>
                                    <Select.Option value="part4">Part 4: Monologue Comprehension</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Đề thi / Tags" name="tags">
                                <Select mode="tags" placeholder="Ví dụ: Aptis General..." />
                            </Form.Item>
                            <Form.Item label="Trạng thái" name="status" initialValue="active">
                                <Select>
                                    <Select.Option value="active">Công khai (Active)</Select.Option>
                                    <Select.Option value="draft">Bản nháp (Draft)</Select.Option>
                                </Select>
                            </Form.Item>
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
                    {isPart1 && renderMCQSection(1, "PART 1: THÔNG TIN CHI TIẾT (1 CÂU HỎI)")}
                    {isPart2 && renderPart2Matching()}
                    {isPart3 && renderPart3Matching()}
                    {isPart4 && renderMCQSection(2, "PART 4: BÀI NÓI DÀI (1 AUDIO - 2 CÂU HỎI)")}
                </div>
            )
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '32px', padding: '0 50px' }}>
                <Steps
                    current={currentStep}
                    items={steps.map(item => ({ key: item.title, title: item.title, icon: item.icon }))}
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
                {steps[currentStep].content}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                {currentStep > 0 && (
                    <Button onClick={prev} icon={<ArrowLeftOutlined />} size="large">
                        Quay lại
                    </Button>
                )}
                {currentStep < steps.length - 1 ? (
                    <Button type="primary" onClick={next} size="large">
                        Tiếp theo <ArrowRightOutlined />
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={onSubmit}
                        icon={<SaveOutlined />}
                        size="large"
                        style={{ background: ADMIN_COLORS.primary, borderColor: ADMIN_COLORS.primary }}
                    >
                        Lưu câu hỏi
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ListeningForm;
