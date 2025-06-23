import { ScoringService } from '../services/ScoringService.js';
import { IQuizAttempt, IScoringWeights } from '../interfaces/scoring.js';
import {describe, it, beforeEach, expect} from 'vitest';

describe('ScoringService', () => {
  let scoringService: ScoringService;

  beforeEach(() => {
    scoringService = new ScoringService();
  });

  it('should calculate correct totalScore and breakdown for a simple attempt', () => {
    const quizAttempt: IQuizAttempt = {
      userId: 'user123',
      quizId: 'quiz123',
      grades: [
        { questionId: 'q1', confidenceScore: 4, result: true }, // high correct
        { questionId: 'q2', confidenceScore: 2, result: false }, // low wrong
        { questionId: 'q3', confidenceScore: 5, result: true }, // high correct
        { questionId: 'q4', confidenceScore: 3, result: true }, // high correct
        { questionId: 'q5', confidenceScore: 1, result: false }, // low wrong
      ],
      basePoints: 10,
      streaks: 2,
      timeTaken: 50,
      idealTime: 60,
      attemptCount: 1,
      hintCount: 3,
    };

    const result = scoringService.calculateScore(quizAttempt);

    // Confidence score: (3 high correct × 2) - (0 high wrong × 2) + (0 low correct × 1) - (2 low wrong × 1) = 6 - 0 + 0 - 2 = 4
    // Hint penalty: 3 × -0.5 = -1.5
    // Streak bonus: 2 × 3 = 6
    // Time bonus: (60 - 50) × 0.2 = 10 × 0.2 = 2
    // Attempt penalty: (1 - 1) × -0.5 = 0
    // Total: 10 + 4 - 1.5 + 6 + 2 + 0 = 20.5 → Math.floor(20.5) = 20
    expect(result.totalScore).toBe(20);
    expect(result.breakdown.basePoints).toBe(10);
    expect(result.breakdown.confidenceScore).toBe(4);
    expect(result.breakdown.totalHintPenalty).toBe(-1.5);
    expect(result.breakdown.streakBonusTotal).toBe(6);
    expect(result.breakdown.timeBonus).toBe(2);
    expect(result.breakdown.totalAttemptPenalty).toBe(0);
  });

  it('should apply penalties correctly for multiple attempts', () => {
    const quizAttempt: IQuizAttempt = {
      userId: 'userX',
      quizId: 'quizX',
      grades: [],
      basePoints: 0,
      streaks: 0,
      timeTaken: 100,
      idealTime: 60,
      attemptCount: 3,
      hintCount: 0,
    };

    const result = scoringService.calculateScore(quizAttempt);

    // Attempt penalty: (3 - 1) × -0.5 = 2 × -0.5 = -1
    // Time bonus: (60 - 100) × 0.2 = -40 × 0.2 = -8
    // Total: 0 + 0 + 0 + 0 - 8 - 1 = -9 → Math.max(0, Math.floor(-9)) = 0
    expect(result.totalScore).toBe(0);
    expect(result.breakdown.totalAttemptPenalty).toBe(-1);
    expect(result.breakdown.timeBonus).toBe(-8);
  });

  it('should calculate confidenceScore correctly', () => {
    const grades = [
      { questionId: 'q1', confidenceScore: 5 as 5, result: true }, // high correct
      { questionId: 'q2', confidenceScore: 2 as 2, result: true }, // low correct
      { questionId: 'q3', confidenceScore: 4 as 4, result: false }, // high wrong
      { questionId: 'q4', confidenceScore: 1 as 1, result: false }, // low wrong
    ];
    // (1 high correct × 2) - (1 high wrong × 2) + (1 low correct × 1) - (1 low wrong × 1) = 2 - 2 + 1 - 1 = 0
    const score = scoringService.calculateConfidenceScore(grades);
    expect(score).toBe(0);
  });

  it('should update weights and use them', () => {
    scoringService.updateWeights({
      highWeight: 3,
      lowWeight: 2,
    });

    const grades = [
      { questionId: 'q1', confidenceScore: 3 as 3, result: true }, // high correct
      { questionId: 'q2', confidenceScore: 2 as 2, result: true }, // low correct
    ];
    // (1 high correct × 3) + (1 low correct × 2) = 3 + 2 = 5
    const score = scoringService.calculateConfidenceScore(grades);
    expect(score).toBe(5);
  });

  it('should return the current weights with getWeights', () => {
    const weights = scoringService.getWeights();
    expect(weights).toEqual({
      highWeight: 2,
      lowWeight: 1,
      hintPenalty: -0.5,
      streakBonus: 3,
      timeWeight: 0.2,
      attemptPenalty: -0.5,
    });
  });

  it('should update weights with updateWeights and reflect in getWeights', () => {
    const newWeights: Partial<IScoringWeights> = {
      highWeight: 5,
      lowWeight: 2,
      hintPenalty: -1,
    };
    scoringService.updateWeights(newWeights);
    const weights = scoringService.getWeights();
    expect(weights.highWeight).toBe(5);
    expect(weights.lowWeight).toBe(2);
    expect(weights.hintPenalty).toBe(-1);
    // unchanged weights should remain the same
    expect(weights.streakBonus).toBe(3);
    expect(weights.timeWeight).toBe(0.2);
    expect(weights.attemptPenalty).toBe(-0.5);
  });
});
