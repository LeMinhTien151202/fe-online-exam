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

const ModalTitle = styled(Space)`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
`;

const LockIcon = styled(UnlockOutlined)`
  color: #9333ea;
`;

const CloseButton = styled(Button)`
  border-radius: 1.5rem !important;
  background: #9333ea !important;
  border-color: #9333ea !important;
  color: white !important;
`;

const TopicText = styled.div`
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
`;

const TabButton = styled(Button)<{ $active: boolean }>`
  border-radius: 12px !important;
  font-size: 12px !important;
  background: ${props => props.$active ? '#9333ea !important' : 'transparent'};
  border-color: ${props => props.$active ? '#9333ea !important' : '#d9d9d9'};
  color: ${props => props.$active ? 'white !important' : 'inherit'};
`;

const StyledDivider = styled(Divider)`
  margin: 12px 0 !important;
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
        <ModalTitle>
          <LockIcon />
          <span>Gợi ý đáp án mẫu • {partTitle}</span>
        </ModalTitle>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <CloseButton key="close" type="primary" onClick={onClose}>
          Đóng
        </CloseButton>,
      ]}
      width={700}
      destroyOnClose
      centered
    >
      <ModalContent>
        <TopicText>
          Chủ đề: {title}
        </TopicText>
        
        {sampleAnswers.length > 1 && (
          <TabButtonGroup>
            {sampleAnswers.map((answer, index) => (
              <TabButton
                key={index}
                size="small"
                type={activeTab === index ? "primary" : "default"}
                onClick={() => setActiveTab(index)}
                $active={activeTab === index}
              >
                {answer.label}
              </TabButton>
            ))}
          </TabButtonGroup>
        )}

        <StyledDivider />

        <AnswerBody>
          {sampleAnswers[activeTab]?.content}
        </AnswerBody>
      </ModalContent>
    </Modal>
  );
};
