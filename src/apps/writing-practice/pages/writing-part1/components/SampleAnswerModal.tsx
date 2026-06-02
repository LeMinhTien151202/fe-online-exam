import React, { useState } from 'react';
import { Modal, Button, Space, Divider } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface ISampleAnswerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  partTitle: string;
  sampleAnswers: Array<{
    label: string;
    content: React.ReactNode;
  }>;
}

const ModalContent = styled.div`
  font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const TabButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const AnswerBody = styled.div`
  background: #f8fafc;
  border-left: 4px solid #9333ea;
  padding: 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.6;
  white-space: pre-line;
  max-height: 350px;
  overflow-y: auto;
`;

export const SampleAnswerModal: React.FC<ISampleAnswerModalProps> = ({
  open,
  onClose,
  title,
  partTitle,
  sampleAnswers,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal
      title={
        <Space style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
          <UnlockOutlined style={{ color: '#9333ea' }} />
          <span>Gợi ý đáp án mẫu • {partTitle}</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" style={{ borderRadius: '1.5rem', background: '#9333ea', borderColor: '#9333ea' }} onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={700}
      destroyOnClose
      centered
    >
      <ModalContent>
        <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          Chủ đề: {title}
        </div>
        
        {sampleAnswers.length > 1 && (
          <TabButtonGroup>
            {sampleAnswers.map((answer, index) => (
              <Button
                key={index}
                size="small"
                type={activeTab === index ? "primary" : "default"}
                onClick={() => setActiveTab(index)}
                style={{
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: activeTab === index ? '#9333ea' : undefined,
                  borderColor: activeTab === index ? '#9333ea' : undefined,
                }}
              >
                {answer.label}
              </Button>
            ))}
          </TabButtonGroup>
        )}

        <Divider style={{ margin: '12px 0' }} />

        <AnswerBody>
          {sampleAnswers[activeTab]?.content}
        </AnswerBody>
      </ModalContent>
    </Modal>
  );
};
