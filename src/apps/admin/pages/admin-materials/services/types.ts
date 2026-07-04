export type FileType = 'PDF' | 'VIDEO';

export const FE_SKILL_TO_ID: Record<string, number> = {
  Grammar: 1,
  Listening: 2,
  Reading: 3,
  Writing: 4,
  Speaking: 5,
};

export const ID_TO_FE_SKILL: Record<number, string> = {
  1: 'Grammar',
  2: 'Listening',
  3: 'Reading',
  4: 'Writing',
  5: 'Speaking',
};

export interface IMaterial {
  id: number;
  title: string;
  fileUrl: string;
  fileType: FileType;
  durationSeconds: number | null;
  skillId: number | null;
  teacherId: number;
  deletedAt: string | null;
  skill?: { id: number; name: string; totalParts: number };
}

export interface ICreateMaterialPayload {
  title: string;
  fileUrl: string;
  fileType: FileType;
  durationSeconds?: number;
  skillId?: number;
}

export interface IUpdateMaterialPayload {
  title?: string;
  fileUrl?: string;
  fileType?: FileType;
  durationSeconds?: number;
  skillId?: number;
}

export interface IMaterialFilter {
  skillId?: number;
  fileType?: FileType;
  search?: string;
  page?: number;
  limit?: number;
}
