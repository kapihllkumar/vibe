

const GAMIFICATION_TYPES = {
  // Services
  MetricService: Symbol.for('MetricService'),
  AchievementService: Symbol.for('AchievementService'),
  ScoringService: Symbol.for('ScoringService'),

  UserGameAchievementsService: Symbol.for('UserGameAchievementsService'),
  UserGameMetricsService: Symbol.for('UserGameMetricsService'),
  MetricTriggerService: Symbol.for('MetricTriggerService'),
  EventService: Symbol.for('EventService'),
  RuleService: Symbol.for('RuleService'),

  // Repositories
  GamifyEngineRepository: Symbol.for('GamifyEngineRepository'),
  WeightsRepo: Symbol.for('ScoringWeightsRepository'),
  GamifyLayerRepository: Symbol.for('GamifyLayerRepository'),
};

<<<<<<< HEAD
export {TYPES as GAMIFICATION_TYPES};
>>>>>>> 16e7e4fe (feat(gamification): Initial commit of Badge/Achievement system.)
=======
export {GAMIFICATION_TYPES};

const QUIZZES_TYPES = {
  SubmissionRepo: Symbol.for('SubmissionRepository')
};

export { QUIZZES_TYPES };
>>>>>>> e4326d50 (gamification)
