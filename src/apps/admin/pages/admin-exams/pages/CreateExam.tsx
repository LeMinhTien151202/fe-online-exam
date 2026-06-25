import React from 'react';
import {
  Card,
  Steps,
  Form,
  Input,
  Radio,
  Select,
  InputNumber,
  Switch,
  Button,
  Table,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  List,
  Tabs,
  Progress,
} from 'antd';

import {
  ArrowLeftOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useCreateExam } from '../hook/useCreateExam';
import { mockBankQuestions } from '../services/mockData';
import * as S from '../styles/styled';

// Selection Components
import ReadingSelection from '../components/ReadingSelection';
import GrammarSelection from '../components/GrammarSelection';
import ListeningSelection from '../components/ListeningSelection';
import SpeakingSelection from '../components/SpeakingSelection';
import WritingSelection from '../components/WritingSelection';
import GeneralSelection from '../components/GeneralSelection';






const { Title, Text, Paragraph } = Typography;

const CreateExam: React.FC = () => {
  const {
    navigate,
    form,
    currentStep,
    selectedQuestions,
    filteredQuestions,
    examConfig,
    handleNext,
    handleBack,
    handleAddQuestion,
    handleRemoveQuestion,
    handleMoveUp,
    handleMoveDown,
    handleAddRandom,
    handlePublish,
  } = useCreateExam();

  const skillValue = Form.useWatch('skill', form) || examConfig.skill;
  const typeValue = Form.useWatch('type', form) || examConfig.type;
  const partValue = Form.useWatch('part', form) || examConfig.part;



  return (
    <S.Container>
      <S.Header>
        <Space size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/admin/exams' })} />
          <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
            Tạo bộ đề thi mới
          </Title>
        </Space>
      </S.Header>

      <Steps
        current={currentStep}
        items={[
          { title: 'Thông tin chung' },
          { title: 'Chọn câu hỏi' },
          { title: 'Xem trước & Xuất bản' },
        ]}
        style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}
      />

      <Form
        form={form}
        layout="vertical"
        preserve={true}
        initialValues={{
          type: 'partial',
          skill: 'Grammar',
          part: 'Part 1',
          vocabTask: 'Task 1',
          difficulty: 'medium',
          duration: 25,
          shuffle: false,
          showExplanation: true,
          limitAttempts: 0,
          viewLayout: 'allInOne',
          accessLimit: 'public',
        }}
      >
        {currentStep === 0 && (
          <Card bordered={false} title="Bước 1: Thông tin cơ bản bộ đề">
            <Row gutter={16}>
              <Col span={24} style={{ marginBottom: 16 }}>
                <Form.Item label="Loại đề thi" name="type" rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value="partial">Luyện theo phần</Radio>
                    <Radio value="set">Luyện theo bộ đề</Radio>
                    <Radio value="full">Thi thử toàn bộ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {typeValue !== 'partial' && (
                <Col span={24}>
                  <Form.Item label="Tên bộ đề" name="name" rules={[{ required: typeValue !== 'partial', message: 'Nhập tên đề!' }]}>
                    <Input placeholder="Ví dụ: Đề thi thử Aptis Grammar & Vocab #10" />
                  </Form.Item>
                </Col>
              )}

              <Col span={typeValue === 'partial' ? 8 : 12}>
                <Form.Item label="Kỹ năng chính" name="skill">
                  <Select onChange={() => {
                    form.setFieldsValue({ part: 'Part 1' });
                  }}>
                    <Select.Option value="Grammar">Grammar & Vocabulary</Select.Option>
                    <Select.Option value="Reading">Đọc hiểu</Select.Option>
                    <Select.Option value="Listening">Nghe</Select.Option>
                    <Select.Option value="Speaking">Nói</Select.Option>
                    <Select.Option value="Writing">Viết</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {typeValue === 'partial' && (
                <Col span={8}>
                  <Form.Item label="Phần câu hỏi" name="part">
                    <Select>

                      {skillValue === 'Grammar' ? (
                        <>
                          <Select.Option value="Part 1">Phần 1: Grammar (25 câu)</Select.Option>
                          <Select.Option value="Part 2">Phần 2: Vocabulary (5 Tasks)</Select.Option>
                        </>
                      ) : skillValue === 'Reading' ? (
                        <>
                          <Select.Option value="Part 1">Part 1: Sentence Comprehension</Select.Option>
                          <Select.Option value="Part 2">Part 2: Text Cohesion (Task 1)</Select.Option>
                          <Select.Option value="Part 3">Part 3: Text Cohesion (Task 2)</Select.Option>
                          <Select.Option value="Part 4">Part 4: Short Text Comprehension</Select.Option>
                          <Select.Option value="Part 5">Part 5: Long Text Comprehension</Select.Option>
                        </>
                      ) : skillValue === 'Listening' ? (
                        <>
                          <Select.Option value="Part 1">Part 1: Information Recognition</Select.Option>
                          <Select.Option value="Part 2">Part 2: Information Matching</Select.Option>
                          <Select.Option value="Part 3">Part 3: Opinion Matching</Select.Option>
                          <Select.Option value="Part 4">Part 4: Monologue Comprehension</Select.Option>
                        </>
                      ) : skillValue === 'Speaking' ? (
                        <>
                          <Select.Option value="Part 1">Part 1: Personal Information</Select.Option>
                          <Select.Option value="Part 2">Part 2: Photo Description</Select.Option>
                          <Select.Option value="Part 3">Part 3: Compare Two Photos</Select.Option>
                          <Select.Option value="Part 4">Part 4: Abstract Topic</Select.Option>
                        </>
                      ) : skillValue === 'Writing' ? (
                        <>
                          <Select.Option value="Part 1">Part 1: Word-level Writing</Select.Option>
                          <Select.Option value="Part 2">Part 2: Short Text</Select.Option>
                          <Select.Option value="Part 3">Part 3: Social Media Chat</Select.Option>
                          <Select.Option value="Part 4">Part 4: Contextual Email</Select.Option>
                        </>
                      ) : (
                        <>
                          <Select.Option value="Part 1">Part 1</Select.Option>
                          <Select.Option value="Part 2">Part 2</Select.Option>
                          <Select.Option value="Part 3">Part 3</Select.Option>
                          <Select.Option value="Part 4">Part 4</Select.Option>
                        </>
                      )}
                    </Select>

                  </Form.Item>
                </Col>
              )}

              <Col span={typeValue === 'partial' ? 8 : 12}>
                <Form.Item label="Thời gian (phút)" name="duration" rules={[{ required: true }]}>
                  <InputNumber min={5} max={180} style={{ width: '100%' }} />
                </Form.Item>
              </Col>


              {typeValue !== 'partial' && (
                <Col span={24}>
                  <Form.Item label="Mô tả bộ đề" name="description">
                    <Input.TextArea placeholder="Mô tả mục tiêu, yêu cầu của bộ đề..." rows={3} />
                  </Form.Item>
                </Col>
              )}
            </Row>

          </Card>
        )}

        {currentStep === 1 && (
          <Row gutter={16}>
            <Col span={24} style={{ marginBottom: '1.5rem' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space direction="vertical" size={0}>
                  <Text strong style={{ fontSize: '18px', color: ADMIN_COLORS.primary }}>
                    {typeValue === 'full' ? 'CHẾ ĐỘ: THI THỬ TOÀN BỘ (FULL 5 SKILLS)' : `Cấu hình Kỹ năng: ${skillValue}`}
                  </Text>
                  <Text type="secondary">
                    {typeValue === 'full'
                      ? 'Vui lòng hoàn thành đủ 5 Tab kỹ năng bên dưới'
                      : (typeValue === 'set' ? 'Chế độ: Luyện theo bộ đề (Full Parts)' : `Chế độ: Luyện tập phần ${partValue}`)}
                  </Text>
                </Space>

                <div style={{ textAlign: 'right' }}>
                  <Text strong>{selectedQuestions.length} câu đã chọn</Text>
                  <Progress
                    percent={Math.min(100, Math.round((selectedQuestions.length / (typeValue === 'full' ? 80 : 5)) * 100))}
                    style={{ width: 300, display: 'block' }}
                    status="active"
                  />
                </div>
              </div>
            </Col>

            <Col span={24}>
              {typeValue === 'full' ? (
                <Tabs
                  defaultActiveKey="Grammar"
                  type="card"
                  items={[
                    {
                      key: 'Grammar',
                      label: '1. Grammar & Vocab',
                      children: <GrammarSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} />
                    },
                    {
                      key: 'Reading',
                      label: '2. Reading',
                      children: <ReadingSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} />
                    },
                    {
                      key: 'Listening',
                      label: '3. Listening',
                      children: <ListeningSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} />
                    },
                    {
                      key: 'Speaking',
                      label: '4. Speaking',
                      children: <SpeakingSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} />
                    },
                    {
                      key: 'Writing',
                      label: '5. Writing',
                      children: <WritingSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} />
                    },
                  ]}
                />
              ) : (
                <>
                  {skillValue === 'Reading' ? (
                    <ReadingSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as any}
                      targetPart={partValue}
                    />
                  ) : skillValue === 'Grammar' ? (
                    <GrammarSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as any}
                      targetPart={partValue}
                    />
                  ) : skillValue === 'Listening' ? (
                    <ListeningSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as any}
                      targetPart={partValue}
                    />
                  ) : skillValue === 'Speaking' ? (
                    <SpeakingSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as any}
                      targetPart={partValue}
                    />
                  ) : skillValue === 'Writing' ? (
                    <WritingSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as any}
                      targetPart={partValue}
                    />
                  ) : (
                    <GeneralSelection
                      filteredQuestions={filteredQuestions}
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                    />
                  )}
                </>
              )}
            </Col>
          </Row>
        )}

        {currentStep === 2 && (
          <Row gutter={16}>
            <Col xs={24} lg={16}>
              <Card title="Giao diện xem trước bộ đề (Mockup)" bordered={false} style={{ background: '#f8fafc' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: '16px' }}>{form.getFieldValue('name')}</Text>
                  <Tag color="red">00:{form.getFieldValue('duration')}:00</Tag>
                </div>
                <div style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '0 0 8px 8px' }}>
                  <Paragraph style={{ fontStyle: 'italic', color: '#64748b' }}>
                    {form.getFieldValue('description') || 'Đề luyện tập này không có mô tả chi tiết...'}
                  </Paragraph>
                  <List
                    size="small"
                    dataSource={selectedQuestions}
                    renderItem={(item: any, index: number) => (
                      <List.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>Câu {index + 1}: {item.content}</Text>
                          <Space style={{ paddingLeft: '1rem' }}>
                            <Radio disabled>Phương án A</Radio>
                            <Radio disabled>Phương án B</Radio>
                            <Radio disabled>Phương án C</Radio>
                            <Radio disabled>Phương án D</Radio>
                          </Space>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Thông tin cấu hình đề" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Tên đề: </Text>
                    <Text strong>{form.getFieldValue('name')}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Thời gian làm bài: </Text>
                    <Text strong>{form.getFieldValue('duration')} phút</Text>
                  </div>
                  <div>
                    <Text type="secondary">Phân loại: </Text>
                    <Tag color="cyan">{typeValue === 'full' ? 'Full Mock Test' : (typeValue === 'set' ? 'Full Set' : 'Partial Practice')}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">Số lượng câu: </Text>
                    <Text strong>{selectedQuestions.length} câu</Text>
                  </div>
                </Space>
                <div style={{ marginTop: '20px' }}>
                  <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    block
                    size="large"
                    onClick={handlePublish}
                    style={{ background: ADMIN_COLORS.success, borderColor: ADMIN_COLORS.success }}
                  >
                    XUẤT BẢN ĐỀ THI
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Form>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
        <Button onClick={handleBack} disabled={currentStep === 0}>Quay lại</Button>
        {currentStep < 2 && (
          <Button type="primary" onClick={handleNext}>Tiếp theo</Button>
        )}
      </div>
    </S.Container>
  );
};

export default CreateExam;
