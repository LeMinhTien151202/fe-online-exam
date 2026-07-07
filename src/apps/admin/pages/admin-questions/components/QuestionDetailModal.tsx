import React from 'react';
import { Modal, Descriptions, Tag, Divider, Typography, Space, Button } from 'antd';
import { FileTextOutlined, InfoCircleOutlined, CheckCircleOutlined, SoundOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import {
  EssayConfig,
  GapFillConfig,
  HeadingMatchConfig,
  IQuestion,
  ListeningSpeakerMatchConfig,
  McConfig,
  OrderingConfig,
  ReadingSpeakerMatchConfig,
  RecordConfig,
  SpeakerAgreementConfig,
  WordBankConfig,
} from '../services/types';

const { Title, Text } = Typography;

interface QuestionDetailModalProps {
    open: boolean;
    onCancel: () => void;
    question: { raw?: IQuestion; content?: string } | null;
}

const SKILL_LABEL: Record<number, string> = {
  1: 'Ngữ pháp & Từ vựng',
  2: 'Nghe',
  3: 'Đọc hiểu',
  4: 'Viết',
  5: 'Nói',
};

const box: React.CSSProperties = {
  padding: '12px 16px',
  background: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  lineHeight: 1.6,
};

const optionRow = (label: string, content: string, correct: boolean) => (
  <div
    key={label + content}
    style={{
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid',
      borderColor: correct ? '#bbf7d0' : '#e2e8f0',
      background: correct ? '#f0fdf4' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <Tag color={correct ? 'success' : 'default'}>{label}</Tag>
    <Text style={{ color: correct ? '#166534' : '#1e293b', fontWeight: correct ? 600 : 400 }}>{content}</Text>
  </div>
);

const sectionTitle = (icon: React.ReactNode, text: string) => (
  <Divider orientation={'left' as never} style={{ margin: '24px 0 16px 0' }}>
    <Space>{icon} {text}</Space>
  </Divider>
);

// Render phần đáp án/cấu hình theo đúng loại câu hỏi
const renderConfig = (q: IQuestion): React.ReactNode => {
  const cfg = q.extraConfig as unknown as Record<string, unknown>;

  // Gap-fill (Reading P1): extraConfig.gaps
  if (cfg && Array.isArray((cfg as unknown as GapFillConfig).gaps)) {
    const gaps = (cfg as unknown as GapFillConfig).gaps;
    return (
      <>
        {sectionTitle(<CheckCircleOutlined />, 'ĐÁP ÁN 5 CHỖ TRỐNG')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {gaps.map((g) => (
            <div key={g.gap_id} style={box}>
              <Text strong>Chỗ trống ({g.gap_id}): </Text>
              {g.options.map((opt, i) =>
                optionRow(String.fromCharCode(65 + i), opt, i === g.correct_index)
              )}
            </div>
          ))}
        </Space>
      </>
    );
  }

  // Listening P3 — Man/Woman/Both
  if (cfg && (cfg as unknown as SpeakerAgreementConfig).choice_kind === 'SPEAKER_AGREEMENT') {
    return (
      <>
        {sectionTitle(<CheckCircleOutlined />, 'ĐÁP ÁN')}
        <div style={box}>
          <Text>Đáp án đúng: </Text>
          <Tag color="success">{(cfg as unknown as SpeakerAgreementConfig).correct}</Tag>
        </div>
      </>
    );
  }

  // MC (Grammar P1, Listening P1/P4): extraConfig.options
  if (cfg && Array.isArray((cfg as unknown as McConfig).options)) {
    const mc = cfg as unknown as McConfig;
    return (
      <>
        {mc.audio_group_id && (
          <div style={{ marginBottom: 12 }}>
            <Tag color="purple">Nhóm audio: {mc.audio_group_id}</Tag>
          </div>
        )}
        {sectionTitle(<CheckCircleOutlined />, 'ĐÁP ÁN')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {mc.options.map((o, i) => optionRow(String.fromCharCode(65 + i), o.content, o.is_correct))}
        </Space>
      </>
    );
  }

  // WORD_BANK (Vocabulary P2)
  if (cfg && Array.isArray((cfg as unknown as WordBankConfig).slots)) {
    const wb = cfg as unknown as WordBankConfig;
    return (
      <>
        {sectionTitle(<InfoCircleOutlined />, `WORD BANK — ${wb.task_variant}`)}
        <div style={{ ...box, marginBottom: 12 }}>
          <Text strong>Ngân hàng từ (10): </Text>
          <Space wrap>{wb.options_pool.map((w) => <Tag key={w}>{w}</Tag>)}</Space>
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          {wb.slots.map((s) => (
            <div key={s.slot_id} style={box}>
              <Text>{s.prompt} → </Text>
              <Tag color="success">{s.correct_answer}</Tag>
            </div>
          ))}
        </Space>
      </>
    );
  }

  // ORDERING (Reading P2/P3)
  if (cfg && Array.isArray((cfg as unknown as OrderingConfig).correct_order)) {
    const ord = cfg as unknown as OrderingConfig;
    return (
      <>
        {sectionTitle(<CheckCircleOutlined />, 'THỨ TỰ ĐÚNG')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {ord.correct_order.map((poolIdx, pos) => (
            <div key={pos} style={box}>
              <Tag color={pos === 0 && ord.fixed_first ? 'gold' : 'blue'}>{pos + 1}</Tag>{' '}
              {ord.options_pool[poolIdx]}
            </div>
          ))}
        </Space>
      </>
    );
  }

  // Reading P4 — SPEAKER_MATCH (people + questions)
  if (cfg && Array.isArray((cfg as unknown as ReadingSpeakerMatchConfig).people)) {
    const rm = cfg as unknown as ReadingSpeakerMatchConfig;
    return (
      <>
        {sectionTitle(<InfoCircleOutlined />, 'CÁC ĐOẠN VĂN')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {rm.people.map((p) => (
            <div key={p.key} style={box}>
              <Tag color="purple">{p.key}</Tag> {p.passage}
            </div>
          ))}
        </Space>
        {sectionTitle(<CheckCircleOutlined />, 'CÂU HỎI & ĐÁP ÁN')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {rm.questions.map((qq, i) => (
            <div key={i} style={box}>
              <Text>{qq.statement} → </Text>
              <Tag color="success">{qq.correct_person}</Tag>
            </div>
          ))}
        </Space>
      </>
    );
  }

  // Listening P2 — SPEAKER_MATCH (options_pool + speakers)
  if (cfg && Array.isArray((cfg as unknown as ListeningSpeakerMatchConfig).speakers)) {
    const lm = cfg as unknown as ListeningSpeakerMatchConfig;
    return (
      <>
        {sectionTitle(<InfoCircleOutlined />, 'NGÂN HÀNG Ý KIẾN')}
        <div style={{ ...box, marginBottom: 12 }}>
          <Space direction="vertical">{lm.options_pool.map((o) => <Text key={o}>• {o}</Text>)}</Space>
        </div>
        {sectionTitle(<CheckCircleOutlined />, 'ĐÁP ÁN TỪNG NGƯỜI')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {lm.speakers.map((s) => (
            <div key={s.speaker_index} style={box}>
              <Tag color="blue">Người {s.speaker_index}</Tag> <Tag color="success">{s.correct_answer}</Tag>
            </div>
          ))}
        </Space>
      </>
    );
  }

  // HEADING_MATCH (Reading P5)
  if (cfg && Array.isArray((cfg as unknown as HeadingMatchConfig).answers)) {
    const hm = cfg as unknown as HeadingMatchConfig;
    return (
      <>
        {sectionTitle(<InfoCircleOutlined />, 'NGÂN HÀNG TIÊU ĐỀ')}
        <div style={{ ...box, marginBottom: 12 }}>
          <Space wrap>{hm.headings_pool.map((h) => <Tag key={h}>{h}</Tag>)}</Space>
        </div>
        {sectionTitle(<CheckCircleOutlined />, 'ĐÁP ÁN TỪNG ĐOẠN')}
        <Space direction="vertical" style={{ width: '100%' }}>
          {hm.answers.map((a) => (
            <div key={a.paragraph_label} style={box}>
              <Tag color="blue">Đoạn {a.paragraph_label}</Tag> <Tag color="success">{a.correct_heading}</Tag>
            </div>
          ))}
        </Space>
      </>
    );
  }

  // ESSAY (Writing): P4 có tasks[], P1/P3 có prompts[], còn lại chỉ giới hạn từ
  if (cfg && ((cfg as unknown as EssayConfig).word_limit_max != null
    || Array.isArray((cfg as unknown as EssayConfig).prompts)
    || Array.isArray((cfg as unknown as EssayConfig).tasks))) {
    const es = cfg as unknown as EssayConfig;
    return (
      <>
        {sectionTitle(<InfoCircleOutlined />, 'YÊU CẦU BÀI VIẾT')}
        {es.context && (
          <div style={{ ...box, marginBottom: 12 }}>
            <Text strong>Bối cảnh (Notice): </Text>{es.context}
          </div>
        )}
        {es.word_limit_max != null && (
          <div style={{ ...box, marginBottom: 12 }}>
            <Text>Giới hạn từ: <Text strong>{es.word_limit_min} - {es.word_limit_max}</Text></Text>
          </div>
        )}

        {/* P2: bài mẫu top-level */}
        {es.sample_answer && (
          <div style={{ ...box, marginBottom: 12, background: '#f0fdf4', borderColor: '#bbf7d0', whiteSpace: 'pre-wrap' }}>
            <Text strong style={{ color: '#166534' }}>Đáp án mẫu: </Text>{es.sample_answer}
          </div>
        )}

        {/* P1/P3: danh sách câu con */}
        {Array.isArray(es.prompts) && es.prompts.length > 0 && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {es.prompts.map((p, i) => (
              <div key={i} style={box}>
                {p.speaker_name && <Tag color="purple">{p.speaker_name}</Tag>}
                <Text>{p.question}</Text>
                {p.sample_answer && (
                  <div style={{ marginTop: 6 }}>
                    <Text type="secondary">Đáp án mẫu: </Text>
                    <Text style={{ color: '#166534' }}>{p.sample_answer}</Text>
                  </div>
                )}
              </div>
            ))}
          </Space>
        )}

        {/* P4: 2 task Informal/Formal */}
        {Array.isArray(es.tasks) && es.tasks.length > 0 && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {es.tasks.map((t, i) => (
              <div key={i} style={box}>
                <Space wrap style={{ marginBottom: 6 }}>
                  <Tag color="blue">{t.task_label}</Tag>
                  <Tag>{t.register_type}</Tag>
                  <Tag>{t.word_limit_min} - {t.word_limit_max} từ</Tag>
                </Space>
                <div><Text>{t.instruction}</Text></div>
                {t.sample_answer && (
                  <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
                    <Text type="secondary">Bài mẫu: </Text>
                    <Text style={{ color: '#166534' }}>{t.sample_answer}</Text>
                  </div>
                )}
              </div>
            ))}
          </Space>
        )}
      </>
    );
  }

  // RECORD (Speaking)
  if (cfg && (cfg as unknown as RecordConfig).response_time_seconds != null) {
    const rc = cfg as unknown as RecordConfig;
    return (
      <>
        {sectionTitle(<InfoCircleOutlined />, 'CẤU HÌNH GHI ÂM')}
        <div style={{ ...box, marginBottom: 12 }}>
          <Space direction="vertical">
            <Text>Thời gian trả lời: <Text strong>{rc.response_time_seconds}s</Text></Text>
            <Text>Thời gian chuẩn bị: <Text strong>{rc.prep_time_seconds}s</Text></Text>
            <Text>Số ảnh: <Text strong>{rc.image_count}</Text></Text>
          </Space>
        </div>
        {!!rc.image_urls?.length && (
          <Space wrap>
            {rc.image_urls.map((u) => (
              <img key={u} src={u} alt="speaking" style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
            ))}
          </Space>
        )}
      </>
    );
  }

  return <Text type="secondary">Không có cấu hình đáp án cho loại câu hỏi này.</Text>;
};

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({ open, onCancel, question }) => {
    const raw = question?.raw;
    if (!question || !raw) return null;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <FileTextOutlined style={{ color: ADMIN_COLORS.primary }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết câu hỏi</Title>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" type="primary" onClick={onCancel} style={{ background: ADMIN_COLORS.primary, borderRadius: '6px' }}>
                    Đóng
                </Button>,
            ]}
            width={720}
            centered
        >
            <div style={{ paddingTop: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Mã câu hỏi">#{raw.id}</Descriptions.Item>
                    <Descriptions.Item label="Loại"><Tag color="geekblue">{raw.questionType}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Kỹ năng"><Tag color="blue">{SKILL_LABEL[raw.skillId] ?? raw.skillId}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Phần">Part {raw.partNumber}</Descriptions.Item>
                    {raw.mediaUrl && (
                        <Descriptions.Item label="Media" span={2}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Space><SoundOutlined /> <a href={raw.mediaUrl} target="_blank" rel="noreferrer">{raw.mediaUrl}</a></Space>
                                <audio src={raw.mediaUrl} controls style={{ width: '100%' }} />
                            </Space>
                        </Descriptions.Item>
                    )}
                </Descriptions>

                {sectionTitle(<InfoCircleOutlined />, 'NỘI DUNG ĐỀ BÀI')}
                <div style={{ ...box, fontSize: 15, whiteSpace: 'pre-wrap' }}>{raw.content}</div>

                {renderConfig(raw)}
            </div>
        </Modal>
    );
};

export default QuestionDetailModal;
