// ============================================================
// Script test luồng thi thử MOCK_TEST: lấy đề -> tự điền đáp án
// (reading/listening/grammar tự chấm; writing/speaking để AI chấm) ->
// upload audio speaking -> nộp bài -> in điểm từng kỹ năng + điểm tổng.
//
// KHÔNG chứa mật khẩu. Đọc access token từ:
//   - biến môi trường TOKEN, hoặc
//   - file scripts/.token (1 dòng JWT)
//
// Chạy:  node scripts/mock-exam-test.mjs [examId]
//   examId (tuỳ chọn): id đề MOCK_TEST muốn làm; bỏ trống -> lấy đề đầu tiên.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const API = process.env.VITE_API_URL || 'http://localhost:6969/api/v1';
const AUDIO_DIR = path.join(ROOT, 'audio-test-speaking');

// ---------- Token ----------
function readToken() {
  if (process.env.TOKEN) return process.env.TOKEN.trim();
  const f = path.join(__dirname, '.token');
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8').trim();
  return null;
}
const TOKEN = readToken();
if (!TOKEN) {
  console.error('❌ Chưa có access token. Đặt biến TOKEN hoặc tạo file scripts/.token');
  process.exit(1);
}

// ---------- HTTP helpers ----------
async function api(method, endpoint, { body, raw = false, isForm = false } = {}) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  let payload;
  if (isForm) {
    payload = body; // FormData: fetch tự set Content-Type + boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${API}${endpoint}`, { method, headers, body: payload });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) {
    const msg = json && json.message ? (Array.isArray(json.message) ? json.message.join(', ') : json.message) : text;
    throw new Error(`HTTP ${res.status} ${method} ${endpoint} -> ${msg}`);
  }
  // BE bọc { code, success, data, metaData }
  if (raw) return json;
  return json && typeof json === 'object' && 'data' in json ? json.data : json;
}

// ---------- Upload audio (cache theo tên file) ----------
const uploadCache = new Map();
async function uploadAudio(fileName) {
  if (uploadCache.has(fileName)) return uploadCache.get(fileName);
  const filePath = path.join(AUDIO_DIR, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`Không tìm thấy audio: ${filePath}`);
  const buf = fs.readFileSync(filePath);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'audio/mpeg' }), fileName);
  const data = await api('POST', '/files/upload?folder_type=audio&prefix=speaking/mock-test', { body: fd, isForm: true });
  const url = data.url;
  uploadCache.set(fileName, url);
  console.log(`   ↑ upload ${fileName} -> ${url}`);
  return url;
}

// File audio có sẵn theo part (cycle nếu số câu > số file)
const AUDIO_BY_PART = {
  1: ['part1_q1.mp3', 'part1_q2.mp3', 'part1_q3.mp3'],
  2: ['part2_q1.mp3', 'part2_q2.mp3', 'part2_q3.mp3'],
  3: ['part3_q1.mp3', 'part3_q2.mp3', 'part3_q3.mp3'],
  4: ['part4.mp3'],
};
const pickAudioName = (part, idx) => {
  const list = AUDIO_BY_PART[part] || AUDIO_BY_PART[1];
  return list[idx % list.length];
};

// ---------- Sinh câu trả lời Writing (ưu tiên sample_answer) ----------
const genericWriting = (min = 20) => {
  const base =
    'I am really interested in this topic and I would love to take part in the activity. ' +
    'In my opinion, joining a club is a great way to meet new people, improve my skills and stay motivated. ' +
    'I usually spend my free time reading, exercising and learning new things, so I believe I can contribute a lot. ' +
    'I hope we can arrange a suitable time and I look forward to hearing from you soon. Thank you very much.';
  return base;
};

// ---------- Dựng đáp án đúng theo từng dạng câu ----------
function buildAnswer(q) {
  const cfg = q.extraConfig || {};
  const type = q.questionType;
  const skillId = q.skillId;

  switch (type) {
    case 'MC': {
      // gap-fill (reading P1): nhiều gap -> mảng index
      if (Array.isArray(cfg.gaps) && cfg.gaps.length) {
        return cfg.gaps.map((g) => g.correct_index);
      }
      // monologue (listening P4): nhiều câu con -> mảng index is_correct
      if (Array.isArray(cfg.questions) && cfg.questions.length) {
        return cfg.questions.map((sub) => (sub.options || []).findIndex((o) => o.is_correct));
      }
      // MC thường -> 1 index
      return (cfg.options || []).findIndex((o) => o.is_correct);
    }
    case 'ORDERING':
      return Array.isArray(cfg.correct_order) ? cfg.correct_order : [];
    case 'WORD_BANK': {
      const obj = {};
      (cfg.slots || []).forEach((s) => { obj[s.slot_id] = s.correct_answer; });
      return obj;
    }
    case 'HEADING_MATCH': {
      const obj = {};
      (cfg.answers || []).forEach((a) => { obj[a.paragraph_label] = a.correct_heading; });
      return obj;
    }
    case 'SPEAKER_MATCH': {
      if (skillId === 2) {
        // Listening: object { speaker_index: correct_answer }
        const obj = {};
        (cfg.speakers || []).forEach((s) => { obj[s.speaker_index] = s.correct_answer; });
        return obj;
      }
      // Reading: mảng correct_person theo thứ tự questions
      return (cfg.questions || []).map((qq) => qq.correct_person);
    }
    case 'SPEAKER_AGREEMENT': // (đề phòng nếu BE trả tên này)
      return (cfg.statements || []).map((s) => s.correct);
    case 'ESSAY': {
      // Writing: mảng bài viết theo thứ tự prompts/tasks (P2 mảng 1 phần tử)
      if (Array.isArray(cfg.prompts) && cfg.prompts.length) {
        return cfg.prompts.map((p) => p.sample_answer || genericWriting());
      }
      if (Array.isArray(cfg.tasks) && cfg.tasks.length) {
        return cfg.tasks.map((t) => t.sample_answer || genericWriting());
      }
      return [cfg.sample_answer || genericWriting()];
    }
    // RECORD xử lý riêng (async upload) ở dưới
    default:
      return null;
  }
}

// SPEAKER_AGREEMENT thực tế BE gắn questionType nào? Mapper đọc statements khi type
// là dạng agreement — kiểm tra thêm cả cfg.statements cho MC an toàn:
function patchAgreement(q, ans) {
  const cfg = q.extraConfig || {};
  if ((ans === -1 || ans == null) && Array.isArray(cfg.statements) && cfg.statements.length) {
    return cfg.statements.map((s) => s.correct);
  }
  return ans;
}

async function buildRecordAnswer(q) {
  const cfg = q.extraConfig || {};
  const part = q.partNumber;
  // P1: mỗi câu 1 URL; P2/P3/P4: gói -> mảng URL theo số câu con
  if (Array.isArray(cfg.questions) && cfg.questions.length) {
    const urls = [];
    for (let i = 0; i < cfg.questions.length; i++) {
      urls.push(await uploadAudio(pickAudioName(part, i)));
    }
    return urls;
  }
  return await uploadAudio(pickAudioName(part, 0));
}

// ---------- Duyệt cây đề, gom mọi câu hỏi ----------
function collectQuestions(detail) {
  const out = [];
  (detail.sections || []).forEach((sec) => {
    (sec.parts || []).forEach((part) => {
      (part.questions || []).forEach((pq) => {
        if (pq.question) out.push(pq.question);
      });
    });
  });
  return out;
}

const SKILL_NAME = { 1: 'Ngữ pháp & Từ vựng', 2: 'Nghe', 3: 'Đọc', 4: 'Viết', 5: 'Nói' };

// ---------- Main ----------
(async () => {
  console.log('=== TEST THI THỬ MOCK_TEST ===');
  console.log('API:', API);

  // 1) Xác nhận token hợp lệ
  const me = await api('GET', '/auth/account');
  console.log(`✔ Đăng nhập: ${me.email} (role ${me.role})`);

  // 2) Lấy danh sách đề MOCK_TEST
  const listEnv = await api('GET', '/exam-sets?type=MOCK_TEST&page=1&limit=50', { raw: true });
  const list = listEnv.data || [];
  console.log(`✔ Có ${list.length} đề MOCK_TEST`);
  if (!list.length) { console.error('❌ Không có đề MOCK_TEST nào trong DB.'); process.exit(1); }

  const argId = Number(process.argv[2]);
  const chosen = Number.isFinite(argId) && argId > 0
    ? list.find((e) => e.id === argId)
    : list.find((e) => e.isActive) || list[0];
  if (!chosen) { console.error('❌ Không tìm thấy đề id=' + argId); process.exit(1); }
  console.log(`✔ Chọn đề #${chosen.id} — "${chosen.title}" (isActive=${chosen.isActive})`);

  // 3) Lấy chi tiết đề (kèm đáp án đúng)
  const detail = await api('GET', `/exam-sets/${chosen.id}`);
  const questions = collectQuestions(detail);
  console.log(`✔ Đề có ${questions.length} câu hỏi (gồm cả câu gói).`);
  const byType = {};
  questions.forEach((q) => { byType[q.questionType] = (byType[q.questionType] || 0) + 1; });
  console.log('   Phân loại:', JSON.stringify(byType));

  // 4) Dựng answers
  const answers = [];
  const skipped = [];
  for (const q of questions) {
    if (q.questionType === 'RECORD') {
      console.log(`   🎙  Speaking part ${q.partNumber} (q#${q.id}) — upload audio...`);
      const response = await buildRecordAnswer(q);
      answers.push({ questionId: q.id, response });
      continue;
    }
    let response = buildAnswer(q);
    response = patchAgreement(q, response);
    const empty =
      response == null ||
      (typeof response === 'number' && response < 0) ||
      (Array.isArray(response) && (response.length === 0 || response.some((v) => v === -1))) ||
      (typeof response === 'object' && !Array.isArray(response) && Object.keys(response).length === 0);
    if (empty) { skipped.push({ id: q.id, type: q.questionType, skillId: q.skillId, cfgKeys: Object.keys(q.extraConfig || {}) }); continue; }
    answers.push({ questionId: q.id, response });
  }

  console.log(`✔ Dựng ${answers.length} đáp án.`);
  if (skipped.length) {
    console.warn(`⚠ Bỏ qua ${skipped.length} câu không dựng được đáp án:`);
    skipped.forEach((s) => console.warn('   -', JSON.stringify(s)));
  }

  // 5) Nộp bài
  console.log('… Nộp bài (AI chấm Writing/Speaking có thể mất ~1-2 phút)...');
  const result = await api('POST', `/exams/${chosen.id}/submit`, { body: { answers } });

  // 6) In kết quả
  console.log('\n================= KẾT QUẢ =================');
  console.log(`Đề #${result.examId} | type=${result.type} | attemptId=${result.attemptId}`);
  console.log(`Điểm tổng (BE 0–100): ${result.score}  | Tự chấm (auto): ${result.autoScore}`);
  console.log(`Điểm trắc nghiệm: ${result.earnedAutoPoints}/${result.totalAutoPoints}`);
  console.log(`Số câu chờ chấm tay: ${result.needsManualReviewCount}`);

  if (Array.isArray(result.skills)) {
    console.log('\n--- Điểm theo kỹ năng (thang Aptis 0–50) ---');
    let total200 = 0;
    for (const s of result.skills) {
      const scaled = s.scaled ?? 0;
      if ([2, 3, 4, 5].includes(s.skillId)) total200 += scaled;
      const extra = s.aiScore != null ? ` | AI ${s.aiScore}/100` : (s.earned != null ? ` | ${s.earned}/${s.total}` : '');
      console.log(`  [${s.skillId}] ${SKILL_NAME[s.skillId] || s.name}: scaled ${scaled}/50 | CEFR ${s.cefr ?? '—'}${extra}`);
    }
    console.log('-------------------------------------------');
    console.log(`ĐIỂM TỔNG (4 kỹ năng, thang 0–200): ${total200}/200`);
    console.log(`CEFR tổng: ${result.overallCefr ?? '—'}`);
    console.log('(Ghi chú: Grammar là Core — có scaled nhưng KHÔNG cộng vào 200.)');
  }

  if (Array.isArray(result.ai) && result.ai.length) {
    console.log('\n--- Chi tiết AI chấm (Writing/Speaking) ---');
    for (const a of result.ai) {
      console.log(`  q#${a.questionId} ${a.questionType} (skill ${a.skillId ?? '?'} part ${a.partNumber ?? '?'}): ` +
        `AI ${a.aiScore ?? 'null'}/100 | band ${a.band ?? '—'}${a.needsManualReview ? ' | ⚠ cần chấm tay' : ''}`);
      if (a.feedback) console.log(`     ↳ ${String(a.feedback).slice(0, 160)}`);
    }
  }
  console.log('\n✅ Xong.');
})().catch((e) => {
  console.error('\n❌ LỖI:', e.message);
  process.exit(1);
});
