import React, { useMemo, useState } from 'react';
import { Modal, List, Input, Checkbox, Tag, Typography, Empty, Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useExamQuestionBank } from '../services/examQuery';
import { questionTypeLabel } from '../../admin-questions/services/types';

const { Text } = Typography;

interface Props {
  open: boolean;
  skillId: number;
  partNumber: number;
  /** id các câu đã có trong part -> loại khỏi danh sách chọn */
  existingQuestionIds: number[];
  confirmLoading?: boolean;
  onClose: () => void;
  onAdd: (questionIds: number[]) => void;
}

// Chọn thêm câu hỏi từ ngân hàng cho 1 part trong form sửa đề
const AddQuestionsModal: React.FC<Props> = ({
  open,
  skillId,
  partNumber,
  existingQuestionIds,
  confirmLoading,
  onClose,
  onAdd,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { bankQuestions, isLoading } = useExamQuestionBank();

  const candidates = useMemo(() => {
    const existing = new Set(existingQuestionIds);
    return bankQuestions.filter(
      (q) =>
        q.skillId === skillId &&
        q.partNumber === partNumber &&
        !existing.has(q.id) &&
        (searchText === '' || q.content.toLowerCase().includes(searchText.toLowerCase())),
    );
  }, [bankQuestions, skillId, partNumber, existingQuestionIds, searchText]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleOk = () => {
    if (selectedIds.length === 0) return;
    onAdd(selectedIds);
    setSelectedIds([]);
    setSearchText('');
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchText('');
    onClose();
  };

  return (
    <Modal
      title={`Thêm câu hỏi vào Part ${partNumber}`}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      okText={selectedIds.length > 0 ? `Thêm ${selectedIds.length} câu đã chọn` : 'Thêm câu hỏi'}
      cancelText="Đóng"
      okButtonProps={{ disabled: selectedIds.length === 0 }}
      confirmLoading={confirmLoading}
      width={720}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm câu hỏi theo nội dung..."
        allowClear
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : (
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          <List
            size="small"
            dataSource={candidates}
            locale={{
              emptyText: (
                <Empty description="Không còn câu hỏi phù hợp trong ngân hàng (đã thêm hết hoặc chưa tạo câu hỏi cho phần này)" />
              ),
            }}
            renderItem={(q) => {
              const checked = selectedIds.includes(q.id);
              return (
                <List.Item
                  onClick={() => toggleSelect(q.id)}
                  style={{
                    cursor: 'pointer',
                    background: checked ? '#f0f9ff' : '#fff',
                    border: `1px solid ${checked ? '#bae6fd' : '#f1f5f9'}`,
                    borderRadius: 6,
                    marginBottom: 6,
                    padding: '8px 12px',
                  }}
                >
                  <Space align="start">
                    <Checkbox checked={checked} onClick={(e) => e.stopPropagation()} onChange={() => toggleSelect(q.id)} />
                    <Tag color="geekblue" style={{ marginTop: 2 }}>{questionTypeLabel(q.raw?.questionType)}</Tag>
                    <Text style={{ fontSize: 13 }} ellipsis={{ tooltip: q.content }}>
                      {q.content}
                    </Text>
                  </Space>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </Modal>
  );
};

export default AddQuestionsModal;
