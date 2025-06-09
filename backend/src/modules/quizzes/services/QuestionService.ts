import {injectable, inject} from 'inversify';
import {NotFoundError, BadRequestError} from 'routing-controllers';
import {QUIZZES_TYPES} from '../types.js';
import {BaseQuestion} from '#quizzes/classes/transformers/Question.js';
import {QuestionProcessor} from '#quizzes/question-processing/QuestionProcessor.js';
import {ParameterMap} from '#quizzes/question-processing/tag-parser/tags/Tag.js';
import {QuestionBankRepository} from '#quizzes/repositories/providers/mongodb/QuestionBankRepository.js';
import {QuestionRepository} from '#quizzes/repositories/providers/mongodb/QuestionRepository.js';
import {BaseService} from '#root/shared/classes/BaseService.js';
import {MongoDatabase} from '#root/shared/database/providers/mongo/MongoDatabase.js';
import {GLOBAL_TYPES} from '#root/types.js';
import {IQuestionRenderView} from '#quizzes/question-processing/renderers/interfaces/RenderViews.js';

@injectable()
class QuestionService extends BaseService {
  constructor(
    @inject(QUIZZES_TYPES.QuestionRepo)
    private questionRepository: QuestionRepository,

    @inject(QUIZZES_TYPES.QuestionBankRepo)
    private questionBankRepository: QuestionBankRepository,

    @inject(GLOBAL_TYPES.Database)
    private database: MongoDatabase, // Replace with actual database type if needed
  ) {
    super(database);
  }

  private async _getQuestionBanksByQuestionId() {}

  public async create(question: BaseQuestion): Promise<string> {
    return this._withTransaction(async session => {
      return await this.questionRepository.create(question, session);
    });
  }

  public async getById(
    questionId: string,
    raw?: boolean,
    parameterMap?: ParameterMap,
  ): Promise<BaseQuestion | IQuestionRenderView> {
    return this._withTransaction(async session => {
      const question = await this.questionRepository.getById(
        questionId,
        session,
      );
      if (!question) {
        throw new NotFoundError(`Question with ID ${questionId} not found`);
      }

      if (raw) {
        return question;
      }

      const questionProcessor = new QuestionProcessor(question);
      return questionProcessor.render(parameterMap);
    });
  }

  public async update(
    questionId: string,
    updatedQuestion: BaseQuestion,
  ): Promise<BaseQuestion | null> {
    return this._withTransaction(async session => {
      const question = await this.questionRepository.getById(
        questionId,
        session,
      );
      if (!question) {
        throw new NotFoundError(`Question with ID ${questionId} not found`);
      }
      if (question.type !== updatedQuestion.type) {
        throw new BadRequestError(
          `Cannot change question type from ${question.type} to ${updatedQuestion.type}`,
        );
      }

      const updated = await this.questionRepository.update(
        questionId,
        updatedQuestion,
        session,
      );
      return updated;
    });
  }

  public async delete(questionId: string): Promise<void> {
    return this._withTransaction(async session => {
      const question = await this.questionRepository.getById(
        questionId,
        session,
      );
      if (!question) {
        throw new NotFoundError(`Question with ID ${questionId} not found`);
      }

      // Remove question from all banks
      await this.questionBankRepository.removeQuestionFromAllBanks(
        questionId,
        session,
      );

      // Delete the question
      await this.questionRepository.delete(questionId, session);
    });
  }
}

export {QuestionService};
