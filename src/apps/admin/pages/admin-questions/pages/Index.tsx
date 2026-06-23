import React from 'react';
import {
  Table,
  Button,
  Tabs,
  Card,
  Input,
  Select,
  Tag,
  Space,
  Typography,
  Modal,
  Steps,
  Radio,
  Form,
  Row,
  Col,
  Tooltip,
  Statistic,
  Progress,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useQuestions } from '../hook/useQuestions';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';

const { Title, Text, Paragraph } = Typography;

const QuestionsIndex: React.FC = () => {
  const {
    skillTab,
    setSkillTab,
    partTab,
    setPartTab,
    questions,
    isModalOpen,
    setIsModalOpen,
    currentStep,
    selectedQuestion,
    form,
    handleNextStep,
    handlePrevStep,
    handleCreateQuestion,
    handleSaveQuestion,
  } = useQuestions();

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <Tooltip title={text}>
          <S.TextEllipsis>
            {text}
          </S.TextEllipsis>
        </Tooltip>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="geekblue">{type}</Tag>,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff: string) => {
        const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
        const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
        return <Tag color={colors[diff]}>{label[diff]}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map(t => <Tag key={t}>{t}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Lượt sử dụng',
      dataIndex: 'useCount',
      key: 'useCount',
    },
    {
      title: 'Tỷ lệ đúng',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <S.FlexAlign>
          <Progress percent={rate} size="small" showInfo={false} strokeColor={rate < 40 ? '#dc2626' : '#16a34a'} style={{ width: 60 }} />
          <Text strong style={{ fontSize: '12px' }}>{rate}%</Text>
        </S.FlexAlign>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Đang dùng' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<CopyOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const skillLabels: Record<string, string> = {
    grammar: 'Ngữ pháp & Từ vựng',
    reading: 'Đọc hiểu',
    listening: 'Nghe',
    speaking: 'Nói',
    writing: 'Viết',
  };

  const skillTitle = skillLabels[skillTab] || 'Ngân hàng câu hỏi';

  return (
    <S.Container>
      <S.Header>
        <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
          Ngân hàng câu hỏi: {skillTitle}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateQuestion}
          style={{ background: ADMIN_COLORS.primary }}
        >
          Thêm câu hỏi
        </Button>
      </S.Header>

      {/* Sub-tabs by part */}
      {skillTab === 'grammar' && (
        <Tabs
          type="card"
          activeKey={partTab}
          onChange={setPartTab}
          items={[
            { key: 'part1', label: 'Part 1: Grammar (25 câu)' },
            { key: 'part2', label: 'Part 2: Vocabulary (25 câu)' },
          ]}
        />
      )}
      {skillTab === 'reading' && (
        <Tabs
          type="card"
          activeKey={partTab}
          onChange={setPartTab}
          items={[
            { key: 'part1', label: 'Phần 1: Sentence Comprehension' },
            { key: 'part2', label: 'Phần 2: Text Cohesion' },
            { key: 'part3', label: 'Phần 3: Short Text' },
            { key: 'part4', label: 'Phần 4: Long Text' },
          ]}
        />
      )}
      {skillTab === 'listening' && (
        <Tabs
          type="card"
          activeKey={partTab}
          onChange={setPartTab}
          items={[
            { key: 'part1', label: 'Phần 1: Điền thông tin vào form' },
            { key: 'part2', label: 'Phần 2: Hội thoại ngắn' },
            { key: 'part3', label: 'Phần 3: Độc thoại dài' },
            { key: 'part4', label: 'Phần 4: Câu hỏi mở' },
          ]}
        />
      )}
      {skillTab === 'speaking' && (
        <Tabs
          type="card"
          activeKey={partTab}
          onChange={setPartTab}
          items={[
            { key: 'part1', label: 'Phần 1: Personal Information' },
            { key: 'part2', label: 'Phần 2: Mô tả hình ảnh' },
            { key: 'part3', label: 'Phần 3: Trả lời câu hỏi chủ đề' },
            { key: 'part4', label: 'Phần 4: Thảo luận tình huống' },
          ]}
        />
      )}
      {skillTab === 'writing' && (
        <Tabs
          type="card"
          activeKey={partTab}
          onChange={setPartTab}
          items={[
            { key: 'part1', label: 'Phần 1: Điền form' },
            { key: 'part2', label: 'Phần 2: Tin nhắn/Note ngắn' },
            { key: 'part3', label: 'Phần 3: Viết đoạn văn xã hội' },
            { key: 'part4', label: 'Phần 4: Viết email phản hồi' },
          ]}
        />
      )}

      {/* Metric overview pills */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false}>
            <Statistic title="Tổng số câu" value={145} valueStyle={{ fontSize: '18px', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false}>
            <Statistic title="Đang sử dụng" value={120} valueStyle={{ fontSize: '18px', fontWeight: 700, color: ADMIN_COLORS.success }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false}>
            <Statistic title="Bản nháp" value={25} valueStyle={{ fontSize: '18px', fontWeight: 700, color: ADMIN_COLORS.textSecondary }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" bordered={false}>
            <Statistic title="Tỷ lệ đúng TB" value="68.4%" valueStyle={{ fontSize: '18px', fontWeight: 700, color: ADMIN_COLORS.info }} />
          </Card>
        </Col>
      </Row>

      {/* Main Table view */}
      <Card bordered={false}>
        <S.FilterBar style={{ marginBottom: '1rem' }}>
          <Input placeholder="Tìm nội dung câu hỏi..." prefix={<SearchOutlined />} style={{ width: 280 }} />
          <Select placeholder="Độ khó" style={{ width: 120 }} allowClear>
            <Select.Option value="easy">Dễ</Select.Option>
            <Select.Option value="medium">Trung bình</Select.Option>
            <Select.Option value="hard">Khó</Select.Option>
          </Select>
          <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
            <Select.Option value="active">Đang dùng</Select.Option>
            <Select.Option value="draft">Bản nháp</Select.Option>
          </Select>
          <Button icon={<UploadOutlined />}>Import Excel</Button>
        </S.FilterBar>

        <Table
          columns={columns}
          dataSource={questions.filter(q => q.type.toLowerCase().includes(skillTab.substring(0, 4)))}
          pagination={false}
          size="middle"
        />
        <AppPagination
          current={1}
          total={questions.length}
          pageSize={8}
          onChange={() => { }}
        />
      </Card>

      {/* Steps Form Modal */}
      <Modal
        title={selectedQuestion ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={900}
        footer={[
          currentStep > 0 && (
            <Button key="back" onClick={handlePrevStep}>
              Quay lại
            </Button>
          ),
          currentStep < 2 ? (
            <Button key="next" type="primary" onClick={handleNextStep} style={{ background: ADMIN_COLORS.primary }}>
              Tiếp tục
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleSaveQuestion} style={{ background: ADMIN_COLORS.success, borderColor: ADMIN_COLORS.success }}>
              Xuất bản câu hỏi
            </Button>
          ),
        ]}
      >
        <div style={{ padding: '1rem 0' }}>
          <Steps
            current={currentStep}
            items={[
              { title: 'Thông tin cơ bản' },
              { title: 'Nội dung câu hỏi' },
              { title: 'Xem trước & Lưu' },
            ]}
            style={{ marginBottom: '2rem' }}
          />

          <Form form={form} layout="vertical" initialValues={{ skill: 'Grammar', part: 'Part 1', difficulty: 'easy', status: 'draft' }}>
            {currentStep === 0 && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Kỹ năng" name="skill" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="Grammar">Grammar & Vocab</Select.Option>
                      <Select.Option value="Reading">Đọc hiểu</Select.Option>
                      <Select.Option value="Listening">Nghe</Select.Option>
                      <Select.Option value="Speaking">Nói</Select.Option>
                      <Select.Option value="Writing">Viết</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phần câu hỏi" name="part" rules={[{ required: true }]}>
                    <Select>
                      <Select.Option value="Part 1">Phần 1</Select.Option>
                      <Select.Option value="Part 2">Phần 2</Select.Option>
                      <Select.Option value="Part 3">Phần 3</Select.Option>
                      <Select.Option value="Part 4">Phần 4</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Độ khó" name="difficulty" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio.Button value="easy">Dễ</Radio.Button>
                      <Radio.Button value="medium">Trung bình</Radio.Button>
                      <Radio.Button value="hard">Khó</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tags" name="tags">
                    <Select mode="tags" placeholder="Chọn hoặc thêm tag mới..." />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ghi chú Admin" name="adminNotes">
                    <Input.TextArea placeholder="Ghi chú nội bộ cho giáo viên/admin..." rows={3} />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Form.Item label="Nội dung câu hỏi đề bài" name="content" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} placeholder="Nhập câu hỏi..." />
                </Form.Item>

                {/* Sub questions or options for grammar match */}
                <div style={{ border: '1px solid #f0f0f0', padding: '1rem', borderRadius: '8px', background: '#fafafa' }}>
                  <Text strong style={{ display: 'block', marginBottom: '1rem' }}>Đáp án lựa chọn (A/B/C/D)</Text>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item label="Đáp án A (Đúng)" name="optA" style={{ marginBottom: '8px' }}>
                      <Input placeholder="Đáp án đúng..." />
                    </Form.Item>
                    <Form.Item label="Đáp án B" name="optB" style={{ marginBottom: '8px' }}>
                      <Input placeholder="Lựa chọn bẫy..." />
                    </Form.Item>
                    <Form.Item label="Đáp án C" name="optC" style={{ marginBottom: '8px' }}>
                      <Input placeholder="Lựa chọn bẫy..." />
                    </Form.Item>
                    <Form.Item label="Đáp án D" name="optD" style={{ marginBottom: '8px' }}>
                      <Input placeholder="Lựa chọn bẫy..." />
                    </Form.Item>
                  </Space>
                </div>

                <Form.Item label="Giải thích đáp án" name="explanation">
                  <Input.TextArea rows={3} placeholder="Nội dung giải thích ngữ pháp hoặc từ vựng..." />
                </Form.Item>
              </div>
            )}

            {currentStep === 2 && (
              <Row gutter={24}>
                <Col span={14}>
                  <Card title="Giao diện hiển thị (Học viên thấy)" size="small" style={{ background: '#f8fafc' }}>
                    <Paragraph style={{ fontSize: '16px', fontWeight: 500 }}>
                      {form.getFieldValue('content') || 'Câu hỏi chưa nhập nội dung...'}
                    </Paragraph>
                    <Space direction="vertical" style={{ width: '100%', paddingLeft: '1rem' }}>
                      <Radio disabled checked>A. {form.getFieldValue('optA') || 'Lựa chọn A'}</Radio>
                      <Radio disabled>B. {form.getFieldValue('optB') || 'Lựa chọn B'}</Radio>
                      <Radio disabled>C. {form.getFieldValue('optC') || 'Lựa chọn C'}</Radio>
                      <Radio disabled>D. {form.getFieldValue('optD') || 'Lựa chọn D'}</Radio>
                    </Space>
                  </Card>
                </Col>
                <Col span={10}>
                  <Card title="Thông tin tổng hợp" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text type="secondary">Kỹ năng: </Text>
                        <Tag color="geekblue">{form.getFieldValue('skill')}</Tag>
                      </div>
                      <div>
                        <Text type="secondary">Phần: </Text>
                        <Tag color="cyan">{form.getFieldValue('part')}</Tag>
                      </div>
                      <div>
                        <Text type="secondary">Độ khó: </Text>
                        <Tag color="warning">{form.getFieldValue('difficulty')}</Tag>
                      </div>
                      <div>
                        <Text type="secondary">Trạng thái phát hành: </Text>
                        <Form.Item name="status" style={{ margin: 0 }}>
                          <Radio.Group size="small">
                            <Radio.Button value="active">Công khai</Radio.Button>
                            <Radio.Button value="draft">Bản nháp</Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </Modal>
    </S.Container>
  );
};

export default QuestionsIndex;
