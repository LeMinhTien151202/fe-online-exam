import React from 'react';
import { Button, Typography, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useQuestions } from '../hook/useQuestions';
import { useQuestionColumns } from '../hook/useQuestionColumns';
import * as S from '../styles/styled';

import MetricOverview from '../components/MetricOverview';
import SkillSubTabs from '../components/SkillSubTabs';
import QuestionTable from '../components/QuestionTable';
import QuestionForm from '../components/QuestionForm';
import QuestionDetailModal from '../components/QuestionDetailModal';

const { Title } = Typography;

const QuestionsIndex: React.FC = () => {
  const {
    skillTab,
    partTab,
    setPartTab,
    questions,
    isModalOpen,
    setIsModalOpen,
    selectedQuestion,
    form,
    handleCreateQuestion,
    handleSaveQuestion,
  } = useQuestions();

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [viewingQuestion, setViewingQuestion] = React.useState<any>(null);

  const handleEdit = (record: any) => {
    setIsModalOpen(true);
  };

  const handleView = (record: any) => {
    setViewingQuestion(record);
    setIsPreviewOpen(true);
  };

  const columns = useQuestionColumns(handleEdit, handleView);

  const skillLabels: Record<string, string> = {
    grammar: 'Ngữ pháp & Từ vựng',
    reading: 'Đọc hiểu',
    listening: 'Nghe',
    speaking: 'Nói',
    writing: 'Viết',
  };

  const filteredQuestions = questions.filter(q =>
    q.type.toLowerCase().includes(skillTab.substring(0, 4)) &&
    (!q.part || q.part === partTab)
  );

  return (
    <S.Container>
      <S.Header>
        <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
          Ngân hàng câu hỏi: {skillLabels[skillTab] || 'Tổng hợp'}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateQuestion}
          style={{ background: ADMIN_COLORS.primary, borderRadius: '8px' }}
        >
          Thêm câu hỏi
        </Button>
      </S.Header>

      <MetricOverview />

      <SkillSubTabs
        skill={skillTab}
        activePart={partTab}
        onChange={setPartTab}
      />

      <QuestionTable
        columns={columns}
        dataSource={filteredQuestions}
        total={filteredQuestions.length}
      />

      <Modal
        title={
          <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
            <Title level={4} style={{ margin: 0 }}>
              {selectedQuestion ? 'Cập nhật câu hỏi' : `Thêm mới: ${skillLabels[skillTab]}`}
            </Title>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={1100}
        centered
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: '20px 0' }}>
          <QuestionForm form={form} skill={skillTab} part={partTab} onSubmit={handleSaveQuestion} />
        </div>
      </Modal>

      <QuestionDetailModal
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        question={viewingQuestion}
      />
    </S.Container>
  );
};

export default QuestionsIndex;
