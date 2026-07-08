import React from 'react';
import { Modal, Form, Input, Button, Radio, Select, InputNumber, Space, Tag, Typography, Divider } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import {
  EssayConfig,
  GapFillConfig,
  HeadingMatchConfig,
  IQuestion,
  IUpdateQuestionPayload,
  ListeningSpeakerMatchConfig,
  McConfig,
  MonologueConfig,
  OrderingConfig,
  QuestionExtraConfig,
  ReadingSpeakerMatchConfig,
  RecordConfig,
  SpeakerAgreementConfig,
  WordBankConfig,
} from '../services/types';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface QuestionEditModalProps {
  open: boolean;
  onCancel: () => void;
  question: { raw?: IQuestion } | null;
  isSaving?: boolean;
  onSave: (id: number, payload: IUpdateQuestionPayload) => void;
}

// Giá trị form phẳng cho từng dạng — đổ từ extraConfig và build ngược lại khi lưu
interface EditFormValues {
  content: string;
  mediaUrl?: string;
  // MC
  mcOptions?: string[];
  mcCorrectIndex?: number;
  // SPEAKER_AGREEMENT (Listening P3) — nhiều nhận định
  agreementStatements?: { statement: string; correct: 'MAN' | 'WOMAN' | 'BOTH' }[];
  // Monologue (Listening P4) — nhiều câu MC / 1 bài nghe
  monoQuestions?: { question: string; options: string[]; correctIndex: number }[];
  // Gap fill
  gaps?: { options: string[]; correct_index: number }[];
  // ORDERING (hiển thị theo đúng thứ tự chuẩn)
  orderedSentences?: string[];
  // WORD_BANK
  wbPool?: string[];
  wbSlots?: { prompt: string; correct_answer: string }[];
  // Listening SPEAKER_MATCH
  lsPool?: string[];
  lsSpeakers?: { correct_answer: string }[];
  // Reading SPEAKER_MATCH
  rsPeople?: { key: string; passage: string }[];
  rsQuestions?: { statement: string; correct_person: string }[];
  // HEADING_MATCH
  hmHeadings?: string[];
  hmParagraphs?: { label: string; text: string; correct_heading: string }[];
  // ESSAY
  wordLimitMin?: number;
  wordLimitMax?: number;
  context?: string;
  // RECORD
  responseTime?: 30 | 45 | 120;
  prepTime?: 0 | 60;
  recordQuestions?: { question: string; sample_answer?: string }[]; // Speaking P2/P3/P4
}

// extraConfig -> giá trị form phẳng
const toFormValues = (q: IQuestion): EditFormValues => {
  const values: EditFormValues = { content: q.content, mediaUrl: q.mediaUrl ?? undefined };
  const cfg = q.extraConfig as unknown as Record<string, unknown>;
  if (!cfg) return values;

  if (Array.isArray((cfg as unknown as GapFillConfig).gaps)) {
    values.gaps = (cfg as unknown as GapFillConfig).gaps.map((g) => ({
      options: [...g.options],
      correct_index: g.correct_index,
    }));
  } else if ((cfg as unknown as SpeakerAgreementConfig).choice_kind === 'SPEAKER_AGREEMENT') {
    values.agreementStatements = (cfg as unknown as SpeakerAgreementConfig).statements.map((s) => ({
      statement: s.statement,
      correct: s.correct,
    }));
  } else if (
    (cfg as unknown as RecordConfig).response_time_seconds == null &&
    !Array.isArray((cfg as unknown as ReadingSpeakerMatchConfig).people) &&
    Array.isArray((cfg as unknown as MonologueConfig).questions)
  ) {
    values.monoQuestions = (cfg as unknown as MonologueConfig).questions.map((q) => ({
      question: q.question,
      options: q.options.map((o) => o.content),
      correctIndex: q.options.findIndex((o) => o.is_correct),
    }));
  } else if (Array.isArray((cfg as unknown as McConfig).options)) {
    const mc = cfg as unknown as McConfig;
    values.mcOptions = mc.options.map((o) => o.content);
    values.mcCorrectIndex = mc.options.findIndex((o) => o.is_correct);
  } else if (Array.isArray((cfg as unknown as WordBankConfig).slots)) {
    const wb = cfg as unknown as WordBankConfig;
    values.wbPool = [...wb.options_pool];
    values.wbSlots = wb.slots.map((s) => ({ prompt: s.prompt, correct_answer: s.correct_answer }));
  } else if (Array.isArray((cfg as unknown as OrderingConfig).correct_order)) {
    const ord = cfg as unknown as OrderingConfig;
    values.orderedSentences = ord.correct_order.map((idx) => ord.options_pool[idx]);
  } else if (Array.isArray((cfg as unknown as ReadingSpeakerMatchConfig).people)) {
    const rm = cfg as unknown as ReadingSpeakerMatchConfig;
    values.rsPeople = rm.people.map((p) => ({ key: p.key, passage: p.passage }));
    values.rsQuestions = rm.questions.map((qq) => ({ statement: qq.statement, correct_person: qq.correct_person }));
  } else if (Array.isArray((cfg as unknown as ListeningSpeakerMatchConfig).speakers)) {
    const lm = cfg as unknown as ListeningSpeakerMatchConfig;
    values.lsPool = [...lm.options_pool];
    values.lsSpeakers = lm.speakers.map((s) => ({ correct_answer: s.correct_answer }));
  } else if (Array.isArray((cfg as unknown as HeadingMatchConfig).answers)) {
    const hm = cfg as unknown as HeadingMatchConfig;
    values.hmHeadings = [...hm.headings_pool];
    values.hmParagraphs = hm.paragraphs.map((p) => ({
      label: p.label,
      text: p.text,
      correct_heading: hm.answers.find((a) => a.paragraph_label === p.label)?.correct_heading ?? '',
    }));
  } else if ((cfg as unknown as EssayConfig).word_limit_max != null) {
    const es = cfg as unknown as EssayConfig;
    values.wordLimitMin = es.word_limit_min;
    values.wordLimitMax = es.word_limit_max;
    values.context = es.context;
  } else if ((cfg as unknown as RecordConfig).response_time_seconds != null) {
    const rc = cfg as unknown as RecordConfig;
    values.responseTime = rc.response_time_seconds;
    values.prepTime = rc.prep_time_seconds;
    if (Array.isArray(rc.questions)) {
      values.recordQuestions = rc.questions.map((q) => ({ question: q.question, sample_answer: q.sample_answer }));
    }
  }
  return values;
};

// Giá trị form -> extraConfig mới (giữ nguyên field không sửa từ config cũ)
const toExtraConfig = (q: IQuestion, v: EditFormValues): QuestionExtraConfig => {
  const old = q.extraConfig as unknown as Record<string, unknown>;

  if (v.gaps) {
    return {
      gaps: v.gaps.map((g, i) => ({ gap_id: i + 1, options: g.options, correct_index: g.correct_index })),
    } as QuestionExtraConfig;
  }
  if (v.agreementStatements) {
    return {
      choice_kind: 'SPEAKER_AGREEMENT',
      statements: v.agreementStatements.map((s) => ({ statement: s.statement, correct: s.correct })),
    } as QuestionExtraConfig;
  }
  if (v.monoQuestions) {
    return {
      questions: v.monoQuestions.map((q) => ({
        question: q.question,
        options: q.options.map((content, i) => ({ content, is_correct: i === q.correctIndex })),
      })),
    } as QuestionExtraConfig;
  }
  if (v.mcOptions) {
    return {
      ...old,
      options: v.mcOptions.map((content, i) => ({ content, is_correct: i === v.mcCorrectIndex })),
    } as unknown as QuestionExtraConfig;
  }
  if (v.wbPool && v.wbSlots) {
    const oldWb = old as unknown as WordBankConfig;
    return {
      task_variant: oldWb.task_variant,
      options_pool: v.wbPool,
      slots: v.wbSlots.map((s, i) => ({ slot_id: oldWb.slots[i]?.slot_id ?? `s${i + 1}`, ...s })),
    } as QuestionExtraConfig;
  }
  if (v.orderedSentences) {
    const oldOrd = old as unknown as OrderingConfig;
    // Nhập theo thứ tự đúng -> pool = danh sách nhập, correct_order = [0..n-1]
    return {
      fixed_first: oldOrd.fixed_first,
      options_pool: v.orderedSentences,
      correct_order: v.orderedSentences.map((_, i) => i),
    } as QuestionExtraConfig;
  }
  if (v.rsPeople && v.rsQuestions) {
    return { people: v.rsPeople, questions: v.rsQuestions } as QuestionExtraConfig;
  }
  if (v.lsPool && v.lsSpeakers) {
    return {
      options_pool: v.lsPool,
      speakers: v.lsSpeakers.map((s, i) => ({ speaker_index: i + 1, correct_answer: s.correct_answer })),
    } as QuestionExtraConfig;
  }
  if (v.hmHeadings && v.hmParagraphs) {
    const oldHm = old as unknown as HeadingMatchConfig;
    return {
      example: oldHm.example,
      headings_pool: v.hmHeadings,
      paragraphs: v.hmParagraphs.map((p) => ({ label: p.label, text: p.text })),
      answers: v.hmParagraphs.map((p) => ({ paragraph_label: p.label, correct_heading: p.correct_heading })),
    } as QuestionExtraConfig;
  }
  if (v.wordLimitMax != null) {
    return {
      ...old,
      word_limit_min: v.wordLimitMin,
      word_limit_max: v.wordLimitMax,
      context: v.context || undefined,
    } as unknown as QuestionExtraConfig;
  }
  if (v.responseTime != null) {
    return {
      ...old,
      response_time_seconds: v.responseTime,
      prep_time_seconds: v.prepTime,
      ...(v.recordQuestions
        ? {
            questions: v.recordQuestions.map((q) => ({
              question: q.question,
              ...(q.sample_answer ? { sample_answer: q.sample_answer } : {}),
            })),
          }
        : {}),
    } as unknown as QuestionExtraConfig;
  }
  return q.extraConfig;
};

const requiredRule = [{ required: true, message: 'Không được để trống' }];

const QuestionEditModal: React.FC<QuestionEditModalProps> = ({ open, onCancel, question, isSaving, onSave }) => {
  const [form] = Form.useForm<EditFormValues>();
  const raw = question?.raw;

  if (!raw) return null;
  const initialValues = toFormValues(raw);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: IUpdateQuestionPayload = {
      content: values.content,
      extraConfig: toExtraConfig(raw, values),
    };
    if (values.mediaUrl !== undefined && values.mediaUrl !== (raw.mediaUrl ?? undefined)) {
      payload.mediaUrl = values.mediaUrl;
    }
    onSave(raw.id, payload);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <EditOutlined style={{ color: ADMIN_COLORS.primary }} />
          <Title level={4} style={{ margin: 0 }}>Chỉnh sửa câu hỏi #{raw.id}</Title>
          <Tag color="geekblue">{raw.questionType}</Tag>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={760}
      centered
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>Hủy bỏ</Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          loading={isSaving}
          onClick={handleSubmit}
          style={{ background: ADMIN_COLORS.primary }}
        >
          Lưu thay đổi
        </Button>,
      ]}
    >
      <div style={{ paddingTop: 16, maxHeight: '68vh', overflowY: 'auto', paddingRight: 8 }}>
        {/* key theo id: đổi câu hỏi -> remount form, nạp lại initialValues (tránh dính dữ liệu câu trước) */}
        <Form key={raw.id} form={form} layout="vertical" initialValues={initialValues} preserve={false}>
          <Form.Item name="content" label="Nội dung đề bài" rules={requiredRule}>
            <TextArea rows={3} autoSize={{ minRows: 2, maxRows: 8 }} />
          </Form.Item>

          {raw.mediaUrl != null && (
            <Form.Item name="mediaUrl" label="Media URL (audio)">
              <Input placeholder="https://.../audio.mp3" />
            </Form.Item>
          )}

          {/* MC — 3 phương án, chọn 1 đúng */}
          {initialValues.mcOptions && (
            <>
              <Divider titlePlacement="left" plain>Phương án trả lời</Divider>
              <Form.Item name="mcCorrectIndex" label="Đáp án đúng" rules={requiredRule}>
                <Radio.Group>
                  {initialValues.mcOptions.map((_, i) => (
                    <Radio key={i} value={i}>{String.fromCharCode(65 + i)}</Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              {initialValues.mcOptions.map((_, i) => (
                <Form.Item key={i} name={['mcOptions', i]} label={`Phương án ${String.fromCharCode(65 + i)}`} rules={requiredRule}>
                  <Input />
                </Form.Item>
              ))}
            </>
          )}

          {/* Listening P3 — Man/Woman/Both: nhiều nhận định trong 1 bản ghi */}
          {initialValues.agreementStatements && (
            <>
              <Divider titlePlacement="left" plain>Các nhận định & đáp án</Divider>
              {initialValues.agreementStatements.map((_, si) => (
                <div key={si} style={{ marginBottom: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <Form.Item name={['agreementStatements', si, 'statement']} label={`Nhận định ${si + 1}`} rules={requiredRule}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={['agreementStatements', si, 'correct']} label="Đáp án đúng" rules={requiredRule} style={{ marginBottom: 0 }}>
                    <Radio.Group>
                      <Radio.Button value="MAN">Man</Radio.Button>
                      <Radio.Button value="WOMAN">Woman</Radio.Button>
                      <Radio.Button value="BOTH">Both</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
            </>
          )}

          {/* Listening P4 — Monologue: nhiều câu MC / 1 bài nghe */}
          {initialValues.monoQuestions && (
            <>
              <Divider titlePlacement="left" plain>Các câu hỏi trong bài nghe</Divider>
              {initialValues.monoQuestions.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <Form.Item name={['monoQuestions', qi, 'question']} label={`Câu ${qi + 1}`} rules={requiredRule}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={['monoQuestions', qi, 'correctIndex']} label="Đáp án đúng" rules={requiredRule}>
                    <Radio.Group>
                      {q.options.map((_, oi) => (
                        <Radio key={oi} value={oi}>{String.fromCharCode(65 + oi)}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                  {q.options.map((_, oi) => (
                    <Form.Item key={oi} name={['monoQuestions', qi, 'options', oi]} label={`Phương án ${String.fromCharCode(65 + oi)}`} rules={requiredRule}>
                      <Input />
                    </Form.Item>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* Reading P1 — gap fill */}
          {initialValues.gaps && (
            <>
              <Divider titlePlacement="left" plain>Đáp án các chỗ trống</Divider>
              {initialValues.gaps.map((g, gi) => (
                <div key={gi} style={{ marginBottom: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <Space align="baseline" wrap>
                    <Text strong>Chỗ ({gi + 1}):</Text>
                    {g.options.map((_, oi) => (
                      <Form.Item key={oi} name={['gaps', gi, 'options', oi]} rules={requiredRule} style={{ marginBottom: 0 }}>
                        <Input style={{ width: 140 }} />
                      </Form.Item>
                    ))}
                    <Form.Item name={['gaps', gi, 'correct_index']} rules={requiredRule} style={{ marginBottom: 0 }}>
                      <Select style={{ width: 110 }} options={g.options.map((_, oi) => ({ value: oi, label: `Đúng: ${String.fromCharCode(65 + oi)}` }))} />
                    </Form.Item>
                  </Space>
                </div>
              ))}
            </>
          )}

          {/* ORDERING — nhập theo thứ tự đúng */}
          {initialValues.orderedSentences && (
            <>
              <Divider titlePlacement="left" plain>Các câu theo thứ tự đúng</Divider>
              {initialValues.orderedSentences.map((_, i) => (
                <Form.Item key={i} name={['orderedSentences', i]} label={`Câu ${i + 1}${i === 0 ? ' (cố định đầu)' : ''}`} rules={requiredRule}>
                  <Input />
                </Form.Item>
              ))}
            </>
          )}

          {/* WORD_BANK */}
          {initialValues.wbPool && (
            <>
              <Divider titlePlacement="left" plain>Ngân hàng từ (10)</Divider>
              <Space wrap>
                {initialValues.wbPool.map((_, i) => (
                  <Form.Item key={i} name={['wbPool', i]} rules={requiredRule} style={{ marginBottom: 8 }}>
                    <Input style={{ width: 130 }} />
                  </Form.Item>
                ))}
              </Space>
              <Divider titlePlacement="left" plain>Các câu hỏi (5)</Divider>
              {initialValues.wbSlots?.map((_, i) => (
                <Space key={i} align="baseline" style={{ display: 'flex', marginBottom: 4 }}>
                  <Form.Item name={['wbSlots', i, 'prompt']} rules={requiredRule} style={{ marginBottom: 8, width: 380 }}>
                    <Input placeholder={`Đề câu ${i + 1}`} />
                  </Form.Item>
                  <Form.Item name={['wbSlots', i, 'correct_answer']} rules={requiredRule} style={{ marginBottom: 8, width: 180 }}>
                    <Input placeholder="Đáp án (thuộc pool)" />
                  </Form.Item>
                </Space>
              ))}
            </>
          )}

          {/* Listening P2 — SPEAKER_MATCH */}
          {initialValues.lsPool && (
            <>
              <Divider titlePlacement="left" plain>Ngân hàng ý kiến (6)</Divider>
              {initialValues.lsPool.map((_, i) => (
                <Form.Item key={i} name={['lsPool', i]} rules={requiredRule} style={{ marginBottom: 8 }}>
                  <Input />
                </Form.Item>
              ))}
              <Divider titlePlacement="left" plain>Đáp án từng người (4)</Divider>
              {initialValues.lsSpeakers?.map((_, i) => (
                <Form.Item key={i} name={['lsSpeakers', i, 'correct_answer']} label={`Người ${i + 1}`} rules={requiredRule}>
                  <Input placeholder="Đáp án (thuộc ngân hàng ý kiến)" />
                </Form.Item>
              ))}
            </>
          )}

          {/* Reading P4 — SPEAKER_MATCH */}
          {initialValues.rsPeople && (
            <>
              <Divider titlePlacement="left" plain>Đoạn văn từng người</Divider>
              {initialValues.rsPeople.map((p, i) => (
                <Form.Item key={i} name={['rsPeople', i, 'passage']} label={`Người ${p.key}`} rules={requiredRule}>
                  <TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
                </Form.Item>
              ))}
              <Divider titlePlacement="left" plain>Câu hỏi & đáp án (7)</Divider>
              {initialValues.rsQuestions?.map((_, i) => (
                <Space key={i} align="baseline" style={{ display: 'flex', marginBottom: 4 }}>
                  <Form.Item name={['rsQuestions', i, 'statement']} rules={requiredRule} style={{ marginBottom: 8, width: 430 }}>
                    <Input placeholder={`Câu ${i + 1}`} />
                  </Form.Item>
                  <Form.Item name={['rsQuestions', i, 'correct_person']} rules={requiredRule} style={{ marginBottom: 8, width: 130 }}>
                    <Select options={initialValues.rsPeople?.map((p) => ({ value: p.key, label: `Người ${p.key}` }))} />
                  </Form.Item>
                </Space>
              ))}
            </>
          )}

          {/* HEADING_MATCH */}
          {initialValues.hmHeadings && (
            <>
              <Divider titlePlacement="left" plain>Ngân hàng tiêu đề (8)</Divider>
              {initialValues.hmHeadings.map((_, i) => (
                <Form.Item key={i} name={['hmHeadings', i]} rules={requiredRule} style={{ marginBottom: 8 }}>
                  <Input />
                </Form.Item>
              ))}
              <Divider titlePlacement="left" plain>Các đoạn văn & tiêu đề đúng (7)</Divider>
              {initialValues.hmParagraphs?.map((p, i) => (
                <div key={i} style={{ marginBottom: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <Form.Item name={['hmParagraphs', i, 'text']} label={`Đoạn ${p.label}`} rules={requiredRule} style={{ marginBottom: 8 }}>
                    <TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
                  </Form.Item>
                  <Form.Item name={['hmParagraphs', i, 'correct_heading']} label="Tiêu đề đúng" rules={requiredRule} style={{ marginBottom: 0 }}>
                    <Input placeholder="Tiêu đề (thuộc ngân hàng tiêu đề)" />
                  </Form.Item>
                </div>
              ))}
            </>
          )}

          {/* ESSAY */}
          {initialValues.wordLimitMax != null && (
            <>
              <Divider titlePlacement="left" plain>Yêu cầu bài viết</Divider>
              <Space size="large">
                <Form.Item name="wordLimitMin" label="Số từ tối thiểu" rules={requiredRule}>
                  <InputNumber min={1} max={500} />
                </Form.Item>
                <Form.Item name="wordLimitMax" label="Số từ tối đa" rules={requiredRule}>
                  <InputNumber min={1} max={500} />
                </Form.Item>
              </Space>
              {initialValues.context !== undefined && (
                <Form.Item name="context" label="Bối cảnh (Notice dùng chung)">
                  <TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
                </Form.Item>
              )}
            </>
          )}

          {/* RECORD */}
          {initialValues.responseTime != null && (
            <>
              <Divider titlePlacement="left" plain>Cấu hình ghi âm</Divider>
              <Space size="large">
                <Form.Item name="responseTime" label="Thời gian trả lời" rules={requiredRule}>
                  <Select
                    style={{ width: 130 }}
                    options={[
                      { value: 30, label: '30 giây' },
                      { value: 45, label: '45 giây' },
                      { value: 120, label: '2 phút' },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="prepTime" label="Thời gian chuẩn bị" rules={requiredRule}>
                  <Select
                    style={{ width: 150 }}
                    options={[
                      { value: 0, label: 'Không chuẩn bị' },
                      { value: 60, label: '1 phút' },
                    ]}
                  />
                </Form.Item>
              </Space>

              {/* Speaking P2/P3/P4 — các câu hỏi gói trong 1 bản ghi */}
              {initialValues.recordQuestions && (
                <>
                  <Divider titlePlacement="left" plain>Các câu hỏi</Divider>
                  {initialValues.recordQuestions.map((_, qi) => (
                    <div key={qi} style={{ marginBottom: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                      <Form.Item name={['recordQuestions', qi, 'question']} label={`Câu ${qi + 1}`} rules={requiredRule}>
                        <Input />
                      </Form.Item>
                      <Form.Item name={['recordQuestions', qi, 'sample_answer']} label="Đáp án mẫu (tuỳ chọn)" style={{ marginBottom: 0 }}>
                        <TextArea autoSize={{ minRows: 1, maxRows: 4 }} />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default QuestionEditModal;
