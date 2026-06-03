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
import * as S from '../styles/styled';

const { Title, Text, Paragraph } = Typography;

const CreateExam: React.FC = () => {
  const {
    navigate,
    form,
    currentStep,
    selectedQuestions,
    mockBankQuestions,
    handleNext,
    handleBack,
    handleAddQuestion,
    handleRemoveQuestion,
    handleMoveUp,
    handleMoveDown,
    handleAddRandom,
    handlePublish,
  } = useCreateExam();

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
          { title: 'Cài đặt nâng cao' },
          { title: 'Xem trước & Xuất bản' },
        ]}
        style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'partial',
          skill: 'Grammar',
          part: 'Part 1',
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
              <Col span={16}>
                <Form.Item label="Tên bộ đề" name="name" rules={[{ required: true, message: 'Nhập tên đề!' }]}>
                  <Input placeholder="Ví dụ: Đề thi thử Aptis Grammar & Vocab #10" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Loại đề thi" name="type" rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value="partial">Luyện theo phần</Radio>
                    <Radio value="full">Thi thử toàn bộ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Kỹ năng chính" name="skill">
                  <Select>
                    <Select.Option value="Grammar">Ngữ pháp & Từ vựng</Select.Option>
                    <Select.Option value="Reading">Đọc hiểu</Select.Option>
                    <Select.Option value="Listening">Nghe</Select.Option>
                    <Select.Option value="Speaking">Nói</Select.Option>
                    <Select.Option value="Writing">Viết</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phần câu hỏi" name="part">
                  <Select>
                    <Select.Option value="Part 1">Phần 1 / Part 1</Select.Option>
                    <Select.Option value="Part 2">Phần 2 / Part 2</Select.Option>
                    <Select.Option value="Part 3">Phần 3 / Part 3</Select.Option>
                    <Select.Option value="Part 4">Phần 4 / Part 4</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Độ khó gợi ý" name="difficulty">
                  <Select>
                    <Select.Option value="easy">Dễ</Select.Option>
                    <Select.Option value="medium">Trung bình</Select.Option>
                    <Select.Option value="hard">Khó</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Thời gian làm bài (Phút)" name="duration" rules={[{ required: true }]}>
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Xáo trộn câu hỏi" name="shuffle" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Hiển thị đáp án sau làm bài" name="showExplanation" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả bộ đề" name="description">
                  <Input.TextArea placeholder="Mô tả ngắn gọn nội dung đề thi..." rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {currentStep === 1 && (
          <Row gutter={16}>
            {/* Left Bank */}
            <Col xs={24} lg={12}>
              <Card title="Ngân hàng câu hỏi" bordered={false} extra={<Button size="small" onClick={() => handleAddRandom(3)}>Chọn ngẫu nhiên 3 câu</Button>}>
                <Table
                  dataSource={mockBankQuestions}
                  size="small"
                  pagination={false}
                  columns={[
                    { title: 'Nội dung', dataIndex: 'content', key: 'content', ellipsis: true },
                    {
                      title: 'Độ khó',
                      dataIndex: 'difficulty',
                      key: 'difficulty',
                      render: (d: string) => <Tag color={d === 'easy' ? 'success' : 'warning'}>{d}</Tag>,
                    },
                    {
                      title: 'Hành động',
                      key: 'action',
                      render: (record: any) => (
                        <Button
                          size="small"
                          type="text"
                          icon={<PlusOutlined style={{ color: ADMIN_COLORS.primary }} />}
                          onClick={() => handleAddQuestion(record)}
                        />
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>

            {/* Right selected */}
            <Col xs={24} lg={12}>
              <Card title={`Câu hỏi đã chọn (${selectedQuestions.length})`} bordered={false}>
                <List
                  dataSource={selectedQuestions}
                  renderItem={(item, index) => (
                    <List.Item
                      actions={[
                        <Button size="small" icon={<ArrowUpOutlined />} onClick={() => handleMoveUp(index)} disabled={index === 0} key="up" />,
                        <Button size="small" icon={<ArrowDownOutlined />} onClick={() => handleMoveDown(index)} disabled={index === selectedQuestions.length - 1} key="down" />,
                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemoveQuestion(item.key)} key="delete" />,
                      ]}
                    >
                      <Space>
                        <Tag color="blue">{index + 1}</Tag>
                        <Text style={{ fontSize: '13px' }} ellipsis>{item.content}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        )}

        {currentStep === 2 && (
          <Card bordered={false} title="Bước 3: Thiết lập hiển thị & Bảo mật">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Giao diện hiển thị" name="viewLayout">
                  <Radio.Group>
                    <Radio value="allInOne">Tất cả câu hỏi trong 1 trang</Radio>
                    <Radio value="oneByOne">Từng câu hỏi một (Next/Prev)</Radio>
                    <Radio value="byPart">Phân nhóm theo các phần thi</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Quyền truy cập" name="accessLimit">
                  <Radio.Group>
                    <Radio value="public">Công khai cho tất cả</Radio>
                    <Radio value="pro">Chỉ học viên gói Pro</Radio>
                    <Radio value="premium">Chỉ học viên gói Premium</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số lần làm tối đa" name="limitAttempts">
                  <InputNumber min={0} placeholder="0 = không giới hạn" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}

        {currentStep === 3 && (
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
                    renderItem={(item, index) => (
                      <List.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>Câu {index + 1}: {item.content}</Text>
                          <Space style={{ paddingLeft: '1rem' }}>
                            <Radio>Phương án A</Radio>
                            <Radio>Phương án B</Radio>
                            <Radio>Phương án C</Radio>
                            <Radio>Phương án D</Radio>
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
                    <Tag color="geekblue">{form.getFieldValue('skill')}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">Tổng số câu chọn: </Text>
                    <Text strong>{selectedQuestions.length} câu</Text>
                  </div>
                  <div>
                    <Text type="secondary">Cấp độ gói: </Text>
                    <Tag color="gold">{form.getFieldValue('accessLimit') === 'public' ? 'Mọi người' : form.getFieldValue('accessLimit')}</Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        )}

        {/* Wizard Footer controls */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {currentStep > 0 && (
            <Button onClick={handleBack}>Quay lại</Button>
          )}
          {currentStep < 3 ? (
            <Button type="primary" onClick={handleNext} style={{ background: ADMIN_COLORS.primary }}>
              Tiếp tục
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={handlePublish}
              style={{ background: ADMIN_COLORS.success, borderColor: ADMIN_COLORS.success }}
            >
              Xuất bản bộ đề thi
            </Button>
          )}
        </div>
      </Form>
    </S.Container>
  );
};

export default CreateExam;
