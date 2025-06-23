export type ConfidenceScore = 1 | 2 | 3 | 4 | 5;

export interface IQuestionGrade {
  questionId: string;
  confidenceScore: ConfidenceScore;
  result: boolean;
}

export interface IQuizAttempt {
  userId: string;
  quizId: string;
  grades: IQuestionGrade[];
  basePoints: number;
  streaks: number;
  timeTaken: number;
  idealTime: number;
  attemptCount: number;
  hintCount: number;
}

export interface IScoreBreakdown {
  basePoints: number;
  confidenceScore: number;
  totalHintPenalty: number;
  streakBonusTotal: number;
  timeBonus: number;
  totalAttemptPenalty: number;
}

export interface IScoringResponse {
  totalScore: number;
  breakdown: IScoreBreakdown;
  pointsAdded: number;
}

export interface IGameElements {
  userId: string;
  points: number;
}

export interface IScoringWeights {
  highWeight: number;
  lowWeight: number;
  hintPenalty: number;
  streakBonus: number;
  timeWeight: number;
  attemptPenalty: number;
}
