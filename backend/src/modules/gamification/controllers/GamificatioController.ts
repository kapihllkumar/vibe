import {
  JsonController,
  Post,
  Body,
  HttpCode,
  Get,
  Put,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { inject, injectable } from 'inversify';
import { ScoringService } from '../services/ScoringService.js';
import { IQuizAttempt, IScoringResponse, IScoringWeights } from '../interfaces/scoring.js';
import { GAMIFICATION_TYPES } from '../types.js';

@OpenAPI({ tags: ['Gamification'] })
@injectable()
@JsonController('/gamification')
export class GamificationController {
  constructor(
    @inject(GAMIFICATION_TYPES.ScoringService)
    private scoringService: ScoringService
  ) {}

  @Post('/score')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Calculate gamification score for a quiz attempt',
    description: 'Calculates score breakdown and returns the total points gained.',
  })
  async calculateScore(@Body() body: IQuizAttempt): Promise<IScoringResponse> {
    return this.scoringService.calculateScore(body);
  }

  @Get('/weights')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Get current scoring weights',
    description: 'Returns the current scoring weights used for gamification.',
  })
  async getWeights(): Promise<IScoringWeights> {
    return this.scoringService.getWeights();
  }

  @Put('/weights')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Update scoring weights',
    description: 'Updates the scoring weights used for gamification.',
  })
  async updateWeights(@Body() body: Partial<IScoringWeights>): Promise<{ message: string }> {
    this.scoringService.updateWeights(body);
    return { message: 'Scoring weights updated successfully.' };
  }

  @Get('/ping')
async ping(): Promise<string> {
  return 'Gamification controller is alive!';
}

}
