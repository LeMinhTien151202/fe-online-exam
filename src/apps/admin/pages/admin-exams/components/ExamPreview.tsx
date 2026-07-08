import React from 'react';
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { ThunderboltOutlined, SoundOutlined, PictureOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { IBankQuestion } from '../services/types';
import {
  EssayConfig,
  GapFillConfig,
  HeadingMatchConfig,
  IQuestion,
  ListeningSpeakerMatchConfig,
  McConfig,
  MonologueConfig,
  OrderingConfig,
  ReadingSpeakerMatchConfig,
  RecordConfig,
  SpeakerAgreementConfig,
  WordBankConfig,
} from '../../admin-questions/services/types';

const { Text, Paragraph } = Typography;

interface ExamPreviewProps {
  title: string;
  description?: string;
  duration?: number;
  typeLabel: string;
  skillLabel?: string;
  partLabel?: string;
  questions: IBankQuestion[];
  isPublishing?: boolean;
  onPublish: () => void;
}

const answerTag = (text: string) => <Tag color="success" style={{ margin: '2px 4px 2px 0' }}>{text}</Tag>;
const plainTag = (text: string) => <Tag style={{ margin: '2px 4px 2px 0' }}>{text}</Tag>;

// Render đáp án thật theo từng dạng câu hỏi (bản rút gọn cho bước xem trước)
const renderAnswer = (q: IQuestion): React.ReactNode => {
  const cfg = q.extraConfig as unknown as Record<string, unknown>;
  if (!cfg) return null;

  // Reading P1 — gap fill
  if (Array.isArray((cfg as unknown as GapFillConfig).gaps)) {
    const gaps = (cfg as unknown as GapFillConfig).gaps;
    if (!gaps?.length) return null;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {gaps.map((g) => (
          <div key={g.gap_id}>
            <Text type="secondary">Chỗ ({g.gap_id}): </Text>
            {g.options?.map((opt, i) => (i === g.correct_index ? answerTag(opt) : plainTag(opt)))}
          </div>
        ))}
      </Space>
    );
  }

  // Listening P3 — Man/Woman/Both: nhiều nhận định trong 1 bản ghi
  if ((cfg as unknown as SpeakerAgreementConfig).choice_kind === 'SPEAKER_AGREEMENT') {
    const sa = cfg as unknown as SpeakerAgreementConfig;
    if (!Array.isArray(sa.statements)) return null;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {sa.statements.map((s, i) => (
          <div key={i}><Text>{i + 1}. {s.statement} → </Text>{answerTag(s.correct)}</div>
        ))}
      </Space>
    );
  }

  // Listening P4 — Monologue: 1 bài nghe, nhiều câu MC
  // Loại trừ Speaking RECORD (có response_time_seconds) và Reading SPEAKER_MATCH (có people[])
  if (
    (cfg as unknown as RecordConfig).response_time_seconds == null &&
    !Array.isArray((cfg as unknown as ReadingSpeakerMatchConfig).people) &&
    Array.isArray((cfg as unknown as MonologueConfig).questions)
  ) {
    const mono = cfg as unknown as MonologueConfig;
    return (
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {mono.questions.map((q, qi) => (
          <div key={qi}>
            <Text strong>Câu {qi + 1}: {q.question}</Text>
            <Space wrap size={4} style={{ display: 'flex', marginTop: 4 }}>
              {q.options?.map((o, i) => (o.is_correct ? answerTag(o.content) : plainTag(`${String.fromCharCode(65 + i)}. ${o.content}`)))}
            </Space>
          </div>
        ))}
      </Space>
    );
  }

  // MC — Grammar P1, Listening P1
  if (Array.isArray((cfg as unknown as McConfig).options)) {
    const mc = cfg as unknown as McConfig;
    return (
      <Space wrap size={4}>
        {mc.options.map((o, i) => (o.is_correct ? answerTag(o.content) : plainTag(`${String.fromCharCode(65 + i)}. ${o.content}`)))}
      </Space>
    );
  }

  // WORD_BANK — Vocabulary P2
  if (Array.isArray((cfg as unknown as WordBankConfig).slots)) {
    const wb = cfg as unknown as WordBankConfig;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Text type="secondary">Ngân hàng từ: {wb.options_pool?.join(', ')}</Text>
        {wb.slots.map((s) => (
          <div key={s.slot_id}><Text>{s.prompt} → </Text>{answerTag(s.correct_answer)}</div>
        ))}
      </Space>
    );
  }

  // ORDERING — Reading P2/P3
  if (Array.isArray((cfg as unknown as OrderingConfig).correct_order)) {
    const ord = cfg as unknown as OrderingConfig;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {ord.correct_order.map((poolIdx, pos) => (
          <div key={pos}>{plainTag(String(pos + 1))}{ord.options_pool?.[poolIdx]}</div>
        ))}
      </Space>
    );
  }

  // Reading P4 — SPEAKER_MATCH (people + questions)
  if (
    Array.isArray((cfg as unknown as ReadingSpeakerMatchConfig).people) &&
    Array.isArray((cfg as unknown as ReadingSpeakerMatchConfig).questions)
  ) {
    const rm = cfg as unknown as ReadingSpeakerMatchConfig;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {rm.questions.map((qq, i) => (
          <div key={i}><Text>{qq.statement} → </Text>{answerTag(qq.correct_person)}</div>
        ))}
      </Space>
    );
  }

  // Listening P2 — SPEAKER_MATCH (options_pool + speakers)
  if (Array.isArray((cfg as unknown as ListeningSpeakerMatchConfig).speakers)) {
    const lm = cfg as unknown as ListeningSpeakerMatchConfig;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {lm.speakers.map((s) => (
          <div key={s.speaker_index}>{plainTag(`Người ${s.speaker_index}`)}{answerTag(s.correct_answer)}</div>
        ))}
      </Space>
    );
  }

  // HEADING_MATCH — Reading P5
  if (Array.isArray((cfg as unknown as HeadingMatchConfig).answers)) {
    const hm = cfg as unknown as HeadingMatchConfig;
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {hm.answers.map((a) => (
          <div key={a.paragraph_label}>{plainTag(`Đoạn ${a.paragraph_label}`)}{answerTag(a.correct_heading)}</div>
        ))}
      </Space>
    );
  }

  // ESSAY — Writing
  if ((cfg as unknown as EssayConfig).word_limit_max != null) {
    const es = cfg as unknown as EssayConfig;
    return (
      <Space wrap size={4}>
        {plainTag(`Giới hạn: ${es.word_limit_min}-${es.word_limit_max} từ`)}
        {es.register_type && plainTag(es.register_type)}
        {es.task_label && plainTag(es.task_label)}
        {es.speaker_name && plainTag(es.speaker_name)}
      </Space>
    );
  }

  // RECORD — Speaking
  if ((cfg as unknown as RecordConfig).response_time_seconds != null) {
    const rc = cfg as unknown as RecordConfig;
    return (
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Space wrap size={4}>
          {plainTag(`Trả lời ${rc.response_time_seconds}s`)}
          {plainTag(`Chuẩn bị ${rc.prep_time_seconds}s`)}
          {plainTag(`${rc.image_count} ảnh`)}
        </Space>
        {Array.isArray(rc.questions) && rc.questions.length > 0 && (
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            {rc.questions.map((q, i) => (
              <div key={i}><Text strong>Câu {i + 1}: </Text><Text>{q.question}</Text></div>
            ))}
          </Space>
        )}
        {Array.isArray(rc.image_urls) && rc.image_urls.length > 0 && (
          <Space wrap>
            {rc.image_urls.map((u) => (
              <img key={u} src={u} alt="speaking" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }} />
            ))}
          </Space>
        )}
      </Space>
    );
  }

  return null;
};

const ExamPreview: React.FC<ExamPreviewProps> = ({
  title,
  description,
  duration,
  typeLabel,
  skillLabel,
  partLabel,
  questions,
  isPublishing,
  onPublish,
}) => {
  const durationLabel = String(duration ?? 0).padStart(2, '0');

  return (
    <Row gutter={16}>
      <Col xs={24} lg={16}>
        <Card title="Giao diện xem trước bộ đề" bordered={false} style={{ background: '#f8fafc' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '16px' }}>{title}</Text>
            <Tag color="red">00:{durationLabel}:00</Tag>
          </div>
          <div style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '0 0 8px 8px' }}>
            <Paragraph style={{ fontStyle: 'italic', color: '#64748b' }}>
              {description || 'Đề luyện tập này không có mô tả chi tiết...'}
            </Paragraph>

            {questions.length === 0 ? (
              <Text type="secondary">Chưa có câu hỏi nào được chọn.</Text>
            ) : (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {questions.map((item, index) => {
                  const raw = item.raw;
                  // Audio chỉ có ở Listening (skillId 2); ảnh chỉ có ở Speaking (skillId 5)
                  const hasAudio = raw?.skillId === 2 && !!raw?.mediaUrl;
                  const hasImages = raw?.skillId === 5 && !!(raw?.extraConfig as unknown as RecordConfig)?.image_count;
                  return (
                    <div key={item.key} style={{ paddingBottom: 12, borderBottom: '1px dashed #e2e8f0' }}>
                      <Space size={8} align="start" style={{ marginBottom: 6 }}>
                        <Tag color="blue">Câu {index + 1}</Tag>
                        <Tag color="geekblue">{raw?.questionType}</Tag>
                        {hasAudio && <SoundOutlined style={{ color: ADMIN_COLORS.primary }} />}
                        {hasImages && <PictureOutlined style={{ color: ADMIN_COLORS.primary }} />}
                      </Space>
                      <Paragraph strong style={{ whiteSpace: 'pre-wrap', marginBottom: 8 }}>{item.content}</Paragraph>
                      {hasAudio && <audio src={raw.mediaUrl!} controls style={{ width: '100%', marginBottom: 8 }} />}
                      {raw && renderAnswer(raw)}
                    </div>
                  );
                })}
              </Space>
            )}
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card title="Thông tin cấu hình đề" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div><Text type="secondary">Tên đề: </Text><Text strong>{title}</Text></div>
            <div><Text type="secondary">Phân loại: </Text><Tag color="cyan">{typeLabel}</Tag></div>
            {skillLabel && <div><Text type="secondary">Kỹ năng: </Text><Tag color="blue">{skillLabel}</Tag></div>}
            {partLabel && <div><Text type="secondary">Phần: </Text><Tag>{partLabel}</Tag></div>}
            <div><Text type="secondary">Thời gian làm bài: </Text><Text strong>{duration} phút</Text></div>
            <div><Text type="secondary">Số lượng câu: </Text><Text strong>{questions.length} câu</Text></div>
          </Space>
          <Divider style={{ margin: '16px 0' }} />
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            block
            size="large"
            loading={isPublishing}
            onClick={onPublish}
            style={{ background: ADMIN_COLORS.primary, borderColor: ADMIN_COLORS.primary }}
          >
            XUẤT BẢN ĐỀ THI
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default ExamPreview;
