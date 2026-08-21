import { uploadAudioBlob } from '@/shared/services/media';

const SAMPLE_AUDIO: Record<number, string[]> = {
  1: ['/sample-audio/part1_q1.mp3', '/sample-audio/part1_q2.mp3', '/sample-audio/part1_q3.mp3'],
  2: ['/sample-audio/part2_q1.mp3', '/sample-audio/part2_q2.mp3', '/sample-audio/part2_q3.mp3'],
  3: ['/sample-audio/part3_q1.mp3', '/sample-audio/part3_q2.mp3', '/sample-audio/part3_q3.mp3'],
  4: ['/sample-audio/part4.mp3'],
};

export const uploadSpeakingSample = (partNumber: number, questionIndex = 0): Promise<string> => {
  const candidates = SAMPLE_AUDIO[partNumber];
  const source = candidates?.[questionIndex % candidates.length];
  if (!source) return Promise.reject(new Error(`Chưa cấu hình audio mẫu cho Speaking Part ${partNumber}.`));

  return (async () => {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Không đọc được file audio mẫu ${source}.`);
    const blob = await response.blob();
    const fileName = source.split('/').pop() ?? `part${partNumber}-sample.mp3`;
    return uploadAudioBlob(blob, `speaking/part/p${partNumber}/sample`, fileName);
  })();
};
