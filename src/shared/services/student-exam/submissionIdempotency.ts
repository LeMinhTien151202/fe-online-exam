import { ISubmitExamPayload } from './types';

const STORAGE_PREFIX = 'exam-submit-idempotency:';

// Key phải đi kèm vân tay nội dung: BE băm bài làm và trả 409 nếu cùng key nhưng khác nội dung.
interface IStoredKey {
  key: string;
  fingerprint: string;
}

const memoryKeys = new Map<number, IStoredKey>();

const storageKey = (examId: number) => `${STORAGE_PREFIX}${examId}`;

const createKey = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `submit-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
};

// Chuẩn hóa giống BE: sort theo questionId rồi mới nối chuỗi, để thứ tự câu không làm đổi vân tay.
const canonicalAnswers = (payload: ISubmitExamPayload): string =>
  JSON.stringify(
    [...(payload.answers ?? [])]
      .sort((left, right) => left.questionId - right.questionId)
      .map((answer) => [answer.questionId, answer.response ?? null]),
  );

// FNV-1a + djb2 ghép lại: đủ để phát hiện "bài làm đã đổi", rẻ và đồng bộ (crypto.subtle là async).
export const submissionFingerprint = (payload: ISubmitExamPayload): string => {
  const source = canonicalAnswers(payload);
  let fnv = 0x811c9dc5;
  let djb2 = 5381;
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    fnv = Math.imul(fnv ^ code, 0x01000193);
    djb2 = Math.imul(djb2, 33) ^ code;
  }
  const toHex = (value: number) => (value >>> 0).toString(16).padStart(8, '0');
  return `${toHex(fnv)}${toHex(djb2)}${source.length.toString(16)}`;
};

const readSessionKey = (examId: number): IStoredKey | null => {
  try {
    const raw = globalThis.sessionStorage?.getItem(storageKey(examId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IStoredKey>;
    if (!parsed?.key || !parsed?.fingerprint) return null;
    return { key: parsed.key, fingerprint: parsed.fingerprint };
  } catch {
    // Dữ liệu cũ (chuỗi key trần) hoặc storage bị chặn -> coi như chưa có key.
    return null;
  }
};

const writeSessionKey = (examId: number, stored: IStoredKey): void => {
  try {
    globalThis.sessionStorage?.setItem(storageKey(examId), JSON.stringify(stored));
  } catch {
    // Private mode/storage policy can block sessionStorage; the in-memory key still protects this page session.
  }
};

// Giữ nguyên key khi nộp lại đúng nội dung cũ (chống chấm trùng sau timeout).
// Nội dung đổi -> cấp key mới, tránh 409 "Idempotency-Key đã được dùng cho nội dung nộp bài khác" kẹt cứng.
export const getOrCreateSubmissionKey = (examId: number, fingerprint: string): string => {
  const existing = memoryKeys.get(examId) ?? readSessionKey(examId);
  if (existing && existing.fingerprint === fingerprint) {
    memoryKeys.set(examId, existing);
    return existing.key;
  }

  const stored: IStoredKey = { key: createKey(), fingerprint };
  memoryKeys.set(examId, stored);
  writeSessionKey(examId, stored);
  return stored.key;
};

export const clearSubmissionKey = (examId: number, completedKey: string): void => {
  if (memoryKeys.get(examId)?.key === completedKey) memoryKeys.delete(examId);
  try {
    if (readSessionKey(examId)?.key === completedKey) {
      globalThis.sessionStorage?.removeItem(storageKey(examId));
    }
  } catch {
    // Nothing to clear when browser storage is unavailable.
  }
};
