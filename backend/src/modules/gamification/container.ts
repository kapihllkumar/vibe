import {ContainerModule} from 'inversify';
import {GAMIFICATION_TYPES, QUIZZES_TYPES} from './types.js';
import {GamifyEngineController} from './controllers/GamifyEngineController.js';
import {
  UserGameMetricsService,
  UserGameAchievementsService,
  AchievementService,
  MetricService,
  MetricTriggerService,
  EventService,
  RuleService,
  ScoringService
} from './services/index.js';
import {GamifyLayerController} from './controllers/GamifyLayerController.js';
import { ScoreController } from '#root/modules/gamification/controllers/ScoreController.js';
import { SubmissionRepository } from '#quizzes/repositories/providers/mongodb/SubmissionRepository.js';
import { ScoringWeightsRepository } from '#shared/database/providers/mongo/repositories/WeightsRepository.js';
export const GamificationContainerModule = new ContainerModule(options => {
  // Service
  options.bind(GAMIFICATION_TYPES.MetricService).to(MetricService);
  options.bind(GAMIFICATION_TYPES.AchievementService).to(AchievementService);
  options
    .bind(GAMIFICATION_TYPES.UserGameAchievementsService)
    .to(UserGameAchievementsService);
  options
    .bind(GAMIFICATION_TYPES.UserGameMetricsService)
    .to(UserGameMetricsService);
  options
    .bind(GAMIFICATION_TYPES.MetricTriggerService)
    .to(MetricTriggerService);
  options.bind(GAMIFICATION_TYPES.EventService).to(EventService);
  options.bind(GAMIFICATION_TYPES.RuleService).to(RuleService);
   options.bind(GAMIFICATION_TYPES.ScoringService).to(ScoringService).inSingletonScope();

  // controllers
  options.bind(GamifyEngineController).toSelf().inSingletonScope();
  options.bind(GamifyLayerController).toSelf().inSingletonScope();
   options.bind(ScoreController).toSelf().inSingletonScope();

   options.bind(GAMIFICATION_TYPES.WeightsRepo).to(ScoringWeightsRepository).inSingletonScope();
  
  // Controllers
   options.bind(QUIZZES_TYPES.SubmissionRepo).to(SubmissionRepository).inSingletonScope();
});
