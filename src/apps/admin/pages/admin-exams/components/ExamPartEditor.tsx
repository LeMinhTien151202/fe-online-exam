import React, { useState } from 'react';
import { Input, Button, Space, Typography, List, Upload, message, Tag } from 'antd';
import { SaveOutlined, UploadOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, SoundOutlined } from '@ant-design/icons';
import { questionApi } from '../../admin-questions/services/questionApi';
import { IExamPart } from '../services/types';
import * as S from './ExamPartEditor.styled';

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  part: IExamPart;
  showAudio: boolean;
  readOnly?: boolean;
  onSavePart: (partId: number, payload: { instruction?: string; audioUrl?: string }) => void;
  onRemoveQuestion: (partId: number, questionId: number) => void;
  onMoveQuestion: (part: IExamPart, index: number, direction: -1 | 1) => void;
}

const ExamPartEditor: React.FC<Props> = ({ part, showAudio, readOnly, onSavePart, onRemoveQuestion, onMoveQuestion }) => {
  const [loadedId, setLoadedId] = useState<number | null>(null);
  const [instruction, setInstruction] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Nạp lại giá trị khi part đổi (điều chỉnh state lúc render thay vì useEffect)
  if (part.id !== loadedId) {
    setLoadedId(part.id);
    setInstruction(part.instruction ?? '');
    setAudioUrl(part.audioUrl ?? '');
  }

  const handleUploadAudio = async (options: { file: unknown; onSuccess?: (r: unknown) => void; onError?: (e: Error) => void }) => {
    const { file, onSuccess, onError } = options;
    try {
      setIsUploading(true);
      const res = await questionApi.upload(file as File, 'audio', `listening/p${part.partNumber}`);
      setAudioUrl(res.url);
      onSuccess?.(res);
      message.success('Tải audio thành công.');
    } catch (err) {
      onError?.(err as Error);
    } finally {
      setIsUploading(false);
    }
  };

  const orderedQuestions = [...part.questions].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <S.PartWrapper>
      <S.PartHeader>
        <Space align="center">
          <Tag color="blue" style={{ margin: 0 }}>Part {part.partNumber}</Tag>
          <Text type="secondary">{orderedQuestions.length} câu hỏi</Text>
        </Space>
        {!readOnly && (
          <Button
            type="primary"
            ghost
            icon={<SaveOutlined />}
            onClick={() => onSavePart(part.id, { instruction, audioUrl: audioUrl || undefined })}
          >
            Lưu phần
          </Button>
        )}
      </S.PartHeader>

      <S.Block>
        <S.FieldLabel>Hướng dẫn (instruction)</S.FieldLabel>
        <TextArea
          rows={2}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder={readOnly ? 'Không có hướng dẫn' : 'Ví dụ: Listen and choose the correct answer.'}
          readOnly={readOnly}
        />
      </S.Block>

      {showAudio && (!readOnly || audioUrl) && (
        <S.Block>
          <S.FieldLabel>Audio dùng chung cả part (Listening P3/P4)</S.FieldLabel>
          {!readOnly && (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://.../audio.mp3"
                prefix={<SoundOutlined />}
              />
              <Upload customRequest={handleUploadAudio as never} showUploadList={false} accept="audio/*">
                <Button icon={<UploadOutlined />} loading={isUploading}>Tải lên</Button>
              </Upload>
            </Space.Compact>
          )}
          {audioUrl && <S.AudioPlayer src={audioUrl} controls />}
        </S.Block>
      )}

      <S.Block>
        <S.FieldLabel>Danh sách câu hỏi</S.FieldLabel>
        <List
          size="small"
          bordered
          dataSource={orderedQuestions}
          locale={{ emptyText: 'Chưa gán câu hỏi' }}
          style={{ background: '#ffffff' }}
          renderItem={(pq, index) => (
          <List.Item
            actions={readOnly ? undefined : [
              <Button key="up" size="small" type="text" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => onMoveQuestion(part, index, -1)} />,
              <Button key="down" size="small" type="text" icon={<ArrowDownOutlined />} disabled={index === orderedQuestions.length - 1} onClick={() => onMoveQuestion(part, index, 1)} />,
              <Button key="del" size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onRemoveQuestion(part.id, pq.questionId)} />,
            ]}
          >
            <Space>
              <Text type="secondary">{index + 1}.</Text>
              {pq.question?.questionType && <Tag>{pq.question.questionType}</Tag>}
              <Text ellipsis style={{ maxWidth: 420 }}>{pq.question?.content ?? `#${pq.questionId}`}</Text>
            </Space>
          </List.Item>
        )}
        />
      </S.Block>
    </S.PartWrapper>
  );
};

export default ExamPartEditor;
