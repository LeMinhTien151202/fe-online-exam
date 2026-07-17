import React, { useMemo } from 'react';
import { Button, Card, Col, Collapse, Divider, Empty, Row, Space, Tag, Typography } from 'antd';
import { ThunderboltOutlined, SoundOutlined, PictureOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { IBankQuestion } from '../services/types';
import * as S from '../styles/styled';
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
  questionTypeLabel,
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

// Tên kỹ năng + màu tag theo skillId (seed BE)
const SKILL_NAME: Record<number, string> = {
  1: 'Grammar & Vocabulary',
  2: 'Nghe (Listening)',
  3: 'Đọc hiểu (Reading)',
  4: 'Viết (Writing)',
  5: 'Nói (Speaking)',
};

const SKILL_TAG_COLOR: Record<number, string> = {
  1: 'cyan',
  2: 'purple',
  3: 'blue',
  4: 'green',
  5: 'orange',
};

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

// 1 câu hỏi trong bản xem trước: nội dung rút gọn + đáp án
const PreviewQuestionItem: React.FC<{ item: IBankQuestion; index: number }> = ({ item, index }) => {
  const raw = item.raw;
  // Audio chỉ có ở Listening (skillId 2); ảnh chỉ có ở Speaking (skillId 5)
  const hasAudio = raw?.skillId === 2 && !!raw?.mediaUrl;
  const hasImages = raw?.skillId === 5 && !!(raw?.extraConfig as unknown as RecordConfig)?.image_count;

  return (
    <S.PreviewQuestion>
      <Space size={8} wrap style={{ marginBottom: 6 }}>
        <Tag color="blue">Câu {index + 1}</Tag>
        <Tag color="geekblue">{questionTypeLabel(raw?.questionType)}</Tag>
        {hasAudio && <SoundOutlined style={{ color: ADMIN_COLORS.primary }} />}
        {hasImages && <PictureOutlined style={{ color: ADMIN_COLORS.primary }} />}
      </Space>
      <Paragraph
        strong
        style={{ whiteSpace: 'pre-wrap', marginBottom: 8 }}
        ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
      >
        {item.content}
      </Paragraph>
      {hasAudio && <audio src={raw.mediaUrl!} controls style={{ width: '100%', marginBottom: 8 }} />}
      {raw && <S.PreviewAnswerBox>{renderAnswer(raw)}</S.PreviewAnswerBox>}
    </S.PreviewQuestion>
  );
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
  // hh:mm:ss từ số phút (sửa lỗi hiển thị "00:90:00" khi > 60 phút)
  const durationLabel = useMemo(() => {
    const mins = duration ?? 0;
    const hh = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm = String(mins % 60).padStart(2, '0');
    return `${hh}:${mm}:00`;
  }, [duration]);

  // Gom câu hỏi theo Kỹ năng -> Part (đúng thứ tự đề thi thật thay vì thứ tự chọn)
  const groups = useMemo(() => {
    const map = new Map<string, { skillId: number; partNumber: number; items: IBankQuestion[] }>();
    questions.forEach((q) => {
      const key = `${q.skillId}-${q.partNumber}`;
      const group = map.get(key) ?? { skillId: q.skillId, partNumber: q.partNumber, items: [] };
      group.items.push(q);
      map.set(key, group);
    });
    return [...map.values()].sort((a, b) => a.skillId - b.skillId || a.partNumber - b.partNumber);
  }, [questions]);

  // Thống kê số câu theo kỹ năng cho sidebar
  const skillCounts = useMemo(() => {
    const map = new Map<number, number>();
    questions.forEach((q) => map.set(q.skillId, (map.get(q.skillId) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [questions]);

  const collapseItems = groups.map((g) => ({
    key: `${g.skillId}-${g.partNumber}`,
    label: (
      <Space size={8}>
        <Tag color={SKILL_TAG_COLOR[g.skillId] ?? 'default'} style={{ margin: 0 }}>
          {SKILL_NAME[g.skillId] ?? `Kỹ năng ${g.skillId}`}
        </Tag>
        <Text strong>Part {g.partNumber}</Text>
        <Text type="secondary">· {g.items.length} câu</Text>
      </Space>
    ),
    children: g.items.map((item, index) => (
      <PreviewQuestionItem key={item.key} item={item} index={index} />
    )),
  }));

  // Ít nhóm (luyện theo phần) -> mở hết; đề nhiều phần -> chỉ mở nhóm đầu cho gọn
  const defaultActiveKeys =
    groups.length <= 3 ? collapseItems.map((i) => i.key) : collapseItems.slice(0, 1).map((i) => i.key);

  return (
    <Row gutter={16}>
      <Col xs={24} lg={16}>
        <Card title="Giao diện xem trước bộ đề" variant="borderless">
          <S.PreviewExamHeader>
            <Text strong style={{ fontSize: '16px' }}>{title}</Text>
            <Tag color="red" icon={<ClockCircleOutlined />} style={{ margin: 0 }}>{durationLabel}</Tag>
          </S.PreviewExamHeader>

          {description && (
            <Paragraph style={{ fontStyle: 'italic', color: '#64748b' }}>{description}</Paragraph>
          )}

          {questions.length === 0 ? (
            <Empty description="Chưa có câu hỏi nào được chọn. Quay lại bước 2 để chọn câu hỏi." />
          ) : (
            <Collapse
              items={collapseItems}
              defaultActiveKey={defaultActiveKeys}
              style={{ background: '#ffffff' }}
            />
          )}
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <S.PreviewSticky>
          <Card title="Thông tin cấu hình đề" variant="borderless">
            <Space direction="vertical" style={{ width: '100%' }} size={4}>
              <S.PreviewSummaryRow>
                <Text type="secondary">Tên đề</Text>
                <Text strong style={{ textAlign: 'right', maxWidth: '65%' }}>{title}</Text>
              </S.PreviewSummaryRow>
              <S.PreviewSummaryRow>
                <Text type="secondary">Phân loại</Text>
                <Tag color="cyan" style={{ margin: 0 }}>{typeLabel}</Tag>
              </S.PreviewSummaryRow>
              {skillLabel && (
                <S.PreviewSummaryRow>
                  <Text type="secondary">Kỹ năng</Text>
                  <Tag color="blue" style={{ margin: 0 }}>{skillLabel}</Tag>
                </S.PreviewSummaryRow>
              )}
              {partLabel && (
                <S.PreviewSummaryRow>
                  <Text type="secondary">Phần</Text>
                  <Tag style={{ margin: 0 }}>{partLabel}</Tag>
                </S.PreviewSummaryRow>
              )}
              <S.PreviewSummaryRow>
                <Text type="secondary">Thời gian làm bài</Text>
                <Text strong>{duration} phút</Text>
              </S.PreviewSummaryRow>
              <S.PreviewSummaryRow>
                <Text type="secondary">Tổng số câu</Text>
                <Text strong>{questions.length} câu</Text>
              </S.PreviewSummaryRow>
            </Space>

            {skillCounts.length > 0 && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>Phân bổ theo kỹ năng</Text>
                <Space direction="vertical" style={{ width: '100%', marginTop: 4 }} size={2}>
                  {skillCounts.map(([skillId, count]) => (
                    <S.PreviewSummaryRow key={skillId}>
                      <Tag color={SKILL_TAG_COLOR[skillId] ?? 'default'} style={{ margin: 0 }}>
                        {SKILL_NAME[skillId] ?? `Kỹ năng ${skillId}`}
                      </Tag>
                      <Text strong>{count} câu</Text>
                    </S.PreviewSummaryRow>
                  ))}
                </Space>
              </>
            )}

            <Divider style={{ margin: '16px 0' }} />
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              block
              size="large"
              loading={isPublishing}
              disabled={questions.length === 0}
              onClick={onPublish}
            >
              XUẤT BẢN ĐỀ THI
            </Button>
            {questions.length === 0 && (
              <Text type="warning" style={{ display: 'block', marginTop: 8, fontSize: 12, textAlign: 'center' }}>
                Cần ít nhất 1 câu hỏi để xuất bản
              </Text>
            )}
          </Card>
        </S.PreviewSticky>
      </Col>
    </Row>
  );
};

export default ExamPreview;
