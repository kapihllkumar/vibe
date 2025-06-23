import {
  IQuizAttempt,
  IScoringResponse,
  IScoreBreakdown,
  IScoringWeights,
  IQuestionGrade,
} from '../interfaces/scoring.js';

import {injectable} from 'inversify';

@injectable()
class ScoringService {
  private weights: IScoringWeights = {
    highWeight: 2,
    lowWeight: 1,
    hintPenalty: -0.5,
    streakBonus: 3,
    timeWeight: 0.2,
    attemptPenalty: -0.5,
  };

  /**
   * Calculates the confidence score from an array of grades.
   */
  public calculateConfidenceScore(grades: IQuestionGrade[]): number {
    let countHighCorrect = 0;
    let countHighWrong = 0;
    let countLowCorrect = 0;
    let countLowWrong = 0;

    for (const grade of grades) {
      const isHigh = grade.confidenceScore >= 3;
      if (grade.result) {
        isHigh ? countHighCorrect++ : countLowCorrect++;
      } else {
        isHigh ? countHighWrong++ : countLowWrong++;
      }
    }

    return (
      (countHighCorrect * this.weights.highWeight) -
      (countHighWrong * this.weights.highWeight) +
      (countLowCorrect * this.weights.lowWeight) -
      (countLowWrong * this.weights.lowWeight)
    );
  }

  public calculateScore(attempt: IQuizAttempt): IScoringResponse {
    const {grades, basePoints, hintCount, streaks, timeTaken, idealTime, attemptCount} = attempt;

    // 1. Confidence score breakdown
    const confidenceScore = this.calculateConfidenceScore(grades);

    // 2. Hint penalty
    const totalHintPenalty = hintCount * this.weights.hintPenalty;

    // 3. Streak bonus
    const streakBonusTotal = streaks * this.weights.streakBonus;

    // 4. Time bonus (positive or negative based on speed)
    const timeBonus = (idealTime - timeTaken) * this.weights.timeWeight;

    // 5. Attempt penalty
    const totalAttemptPenalty = (attemptCount - 1) * this.weights.attemptPenalty === 0 ? 0 : (attemptCount - 1) * this.weights.attemptPenalty;

    // 6. Final score
    const totalScore = basePoints + confidenceScore + totalHintPenalty + streakBonusTotal + timeBonus + totalAttemptPenalty;

    const breakdown: IScoreBreakdown = {
      basePoints,
      confidenceScore,
      totalHintPenalty,
      streakBonusTotal,
      timeBonus,
      totalAttemptPenalty,
    };

    return {
      totalScore: Math.max(0, Math.floor(totalScore)),
      breakdown,
      pointsAdded: Math.max(0, Math.floor(totalScore)), // default to full score
    };
  }

  public getWeights(): IScoringWeights {
    return this.weights;
  }

  public updateWeights(newWeights: Partial<IScoringWeights>): void {
    this.weights = {...this.weights, ...newWeights};
  }
}

export {ScoringService};
