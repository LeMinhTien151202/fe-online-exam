import React, { useState } from 'react';
import { Input, Button, Space, Typography, List, Upload, message, Tag } from 'antd';
import { SaveOutlined, UploadOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, SoundOutlined } from '@ant-design/icons';
import { questionApi } from '../../admin-questions/services/questionApi';
import { IExamPart } from '../services/types';

const { Text } = Typography;
const { TextArea } = Input;

interface Props {
  part: IExamPart;
  showAudio: boolean;
  onSavePart: (partId: number, payload: { instruction?: string; audioUrl?: string }) => void;
  onRemoveQuestion: (partId: number, questionId: number) => void;
  onMoveQuestion: (part: IExamPart, index: number, direction: -1 | 1) => void;
}

const ExamPartEditor: React.FC<Props> = ({ part, showAudio, onSavePart, onRemoveQuestion, onMoveQuestion }) => {
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
    <div className="mb-4 p-4 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <Space align="center" className="mb-3">
        <Tag color="blue">Part {part.partNumber}</Tag>
        <Text type="secondary">{orderedQuestions.length} câu hỏi</Text>
      </Space>

      <div className="mb-2">
        <Text strong>Hướng dẫn (instruction)</Text>
        <TextArea
          rows={2}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Ví dụ: Listen and choose the correct answer."
          className="mt-1"
        />
      </div>

      {showAudio && (
        <div className="mb-2">
          <Text strong>Audio dùng chung cả part (Listening P3/P4)</Text>
          <Space.Compact className="w-full mt-1">
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
          {audioUrl && <audio src={audioUrl} controls className="w-full mt-2" />}
        </div>
      )}

      <Button
        type="dashed"
        icon={<SaveOutlined />}
        size="small"
        onClick={() => onSavePart(part.id, { instruction, audioUrl: audioUrl || undefined })}
      >
        Lưu phần
      </Button>

      <List
        className="mt-3"
        size="small"
        bordered
        dataSource={orderedQuestions}
        locale={{ emptyText: 'Chưa gán câu hỏi' }}
        renderItem={(pq, index) => (
          <List.Item
            actions={[
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
    </div>
  );
};

export default ExamPartEditor;
