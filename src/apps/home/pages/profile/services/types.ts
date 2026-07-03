export type AptisGoal = 'B1' | 'B2' | 'C';

export interface IProfile {
  userId: number;
  fullName: string;
  avatarUrl: string | null;
  targetDate: string | null;
  aptisGoal: AptisGoal | null;
  schoolName: string | null;
  overallMockAvg: number;
}

export interface IUpdateProfilePayload {
  full_name?: string;
  avatar_url?: string;
  target_date?: string;
  aptis_goal?: AptisGoal;
  school_name?: string;
}
