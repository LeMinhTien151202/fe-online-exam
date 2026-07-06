import {
Button,
Card,
Col,
Form,
Input,
InputNumber,
Progress,
Radio,
Row,
Select,
Space,
Steps,
Tabs,
Typography
} from 'antd';
import React from 'react';

import {
ArrowLeftOutlined
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useCreateExam } from '../hook/useCreateExam';
import * as S from '../styles/styled';

// Selection Components
import GeneralSelection from '../components/GeneralSelection';
import GrammarSelection from '../components/GrammarSelection';
import ListeningSelection from '../components/ListeningSelection';
import ReadingSelection from '../components/ReadingSelection';
import SpeakingSelection from '../components/SpeakingSelection';
import WritingSelection from '../components/WritingSelection';
import PartPracticeSelection from '../components/PartPracticeSelection';
import ExamPreview from '../components/ExamPreview';






const { Title, Text } = Typography;

const SKILL_LABEL: Record<string, string> = {
  Grammar: 'Grammar & Vocabulary',
  Reading: 'Đọc hiểu',
  Listening: 'Nghe',
  Speaking: 'Nói',
  Writing: 'Viết',
};

const TYPE_LABEL: Record<string, string> = {
  full: 'Full Mock Test',
  set: 'Full Set',
  partial: 'Partial Practice',
};

const CreateExam: React.FC = () => {
  const {
    navigate,
    form,
    currentStep,
    selectedQuestions,
    filteredQuestions,
    bankQuestions,
    isPublishing,
    examConfig,
    handleNext,
    handleBack,
    handleAddQuestion,
    handleAddAll,
    handleRemoveQuestion,
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
                      children: <GrammarSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} bankQuestions={bankQuestions} />
                    },
                    {
                      key: 'Reading',
                      label: '2. Reading',
                      children: <ReadingSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} bankQuestions={bankQuestions} />
                    },
                    {
                      key: 'Listening',
                      label: '3. Listening',
                      children: <ListeningSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} bankQuestions={bankQuestions} />
                    },
                    {
                      key: 'Speaking',
                      label: '4. Speaking',
                      children: <SpeakingSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} bankQuestions={bankQuestions} />
                    },
                    {
                      key: 'Writing',
                      label: '5. Writing',
                      children: <WritingSelection selectedQuestions={selectedQuestions} handleAddQuestion={handleAddQuestion} handleRemoveQuestion={handleRemoveQuestion} bankQuestions={bankQuestions} />
                    },
                  ]}
                />
              ) : typeValue === 'partial' ? (
                <PartPracticeSelection
                  skill={skillValue}
                  targetPart={partValue}
                  bankQuestions={bankQuestions}
                  selectedQuestions={selectedQuestions}
                  handleAddQuestion={handleAddQuestion}
                  handleRemoveQuestion={handleRemoveQuestion}
                  handleAddAll={handleAddAll}
                />
              ) : (
                <>
                  {skillValue === 'Reading' ? (
                    <ReadingSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as 'partial' | 'set' | 'full'}
                      targetPart={partValue}
                      bankQuestions={bankQuestions}
                    />
                  ) : skillValue === 'Grammar' ? (
                    <GrammarSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as 'partial' | 'set' | 'full'}
                      targetPart={partValue}
                      bankQuestions={bankQuestions}
                    />
                  ) : skillValue === 'Listening' ? (
                    <ListeningSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as 'partial' | 'set' | 'full'}
                      targetPart={partValue}
                      bankQuestions={bankQuestions}
                    />
                  ) : skillValue === 'Speaking' ? (
                    <SpeakingSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as 'partial' | 'set' | 'full'}
                      targetPart={partValue}
                      bankQuestions={bankQuestions}
                    />
                  ) : skillValue === 'Writing' ? (
                    <WritingSelection
                      selectedQuestions={selectedQuestions}
                      handleAddQuestion={handleAddQuestion}
                      handleRemoveQuestion={handleRemoveQuestion}
                      mode={typeValue as 'partial' | 'set' | 'full'}
                      targetPart={partValue}
                      bankQuestions={bankQuestions}
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
          <ExamPreview
            title={form.getFieldValue('name') || `Luyện ${skillValue}${typeValue === 'partial' ? ` ${partValue}` : ''}`.trim()}
            description={form.getFieldValue('description')}
            duration={form.getFieldValue('duration')}
            typeLabel={TYPE_LABEL[typeValue] ?? 'Partial Practice'}
            skillLabel={typeValue !== 'full' ? (SKILL_LABEL[skillValue] ?? skillValue) : undefined}
            partLabel={typeValue === 'partial' ? partValue : undefined}
            questions={selectedQuestions}
            isPublishing={isPublishing}
            onPublish={handlePublish}
          />
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
