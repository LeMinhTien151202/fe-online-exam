import React, { useState } from 'react';
import { Card, InputNumber, Button, Space, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import ExamPartEditor from './ExamPartEditor';
import { IExamSection, IExamPart, ID_TO_FE_SKILL } from '../services/types';

const { Text } = Typography;

interface Props {
  section: IExamSection;
  readOnly?: boolean;
  onSaveDuration: (sectionId: number, durationMinutes: number) => void;
  onSavePart: (partId: number, payload: { instruction?: string; audioUrl?: string }) => void;
  onRemoveQuestion: (partId: number, questionId: number) => void;
  onMoveQuestion: (part: IExamPart, index: number, direction: -1 | 1) => void;
  onAddQuestions: (part: IExamPart, questionIds: number[]) => void;
}

const ExamSectionCard: React.FC<Props> = ({ section, readOnly, onSaveDuration, onSavePart, onRemoveQuestion, onMoveQuestion, onAddQuestions }) => {
  const [loadedId, setLoadedId] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);

  if (section.id !== loadedId) {
    setLoadedId(section.id);
    setDuration(section.durationMinutes);
  }

  const skillName = section.skill?.name || ID_TO_FE_SKILL[section.skillId] || `Skill ${section.skillId}`;
  const isListening = section.skillId === 2;

  return (
    <Card
      title={<Space><Text strong>{skillName}</Text></Space>}
      extra={
        <Space size="middle">
          <Text type="secondary">Thời gian làm bài:</Text>
          {readOnly ? (
            <Text strong>{duration} phút</Text>
          ) : (
            <>
              <InputNumber min={1} max={180} value={duration} onChange={(v) => setDuration(v ?? 0)} addonAfter="phút" style={{ width: 130 }} />
              <Button type="primary" ghost icon={<SaveOutlined />} onClick={() => onSaveDuration(section.id, duration)}>Lưu</Button>
            </>
          )}
        </Space>
      }
    >
      {[...section.parts]
        .sort((a, b) => a.partNumber - b.partNumber)
        .map((part) => (
          <ExamPartEditor
            key={part.id}
            part={part}
            skillId={section.skillId}
            readOnly={readOnly}
            showAudio={isListening && (part.partNumber === 3 || part.partNumber === 4)}
            onSavePart={onSavePart}
            onRemoveQuestion={onRemoveQuestion}
            onMoveQuestion={onMoveQuestion}
            onAddQuestions={onAddQuestions}
          />
        ))}
    </Card>
  );
};

export default ExamSectionCard;
