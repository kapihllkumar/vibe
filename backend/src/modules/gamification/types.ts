<<<<<<< HEAD
const GAMIFICATION_TYPES = {
  ScoringService: Symbol.for('ScoringService'),
};

export { GAMIFICATION_TYPES };
=======
const TYPES = {
  // Services
  MetricService: Symbol.for('MetricService'),
  AchievementService: Symbol.for('AchievementService'),
  UserGameAchievementsService: Symbol.for('UserGameAchievementsService'),
  UserGameMetricsService: Symbol.for('UserGameMetricsService'),
  MetricTriggerService: Symbol.for('MetricTriggerService'),
  EventService: Symbol.for('EventService'),
  RuleService: Symbol.for('RuleService'),

  // Repositories
  GamifyEngineRepository: Symbol.for('GamifyEngineRepository'),
  GamifyLayerRepository: Symbol.for('GamifyLayerRepository'),
};

export {TYPES as GAMIFICATION_TYPES};
>>>>>>> 16e7e4fe (feat(gamification): Initial commit of Badge/Achievement system.)
