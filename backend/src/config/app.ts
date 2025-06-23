import {env} from '#root/utils/env.js';

// src/constants/AppModule.ts (or a shared constants directory)

export enum AppModule {
  All = 'all',
  Auth = 'auth',
  Users = 'users',
  Courses = 'courses',
  Quizzes = 'quizzes',
  Gamification = 'gamification',
}

export const appConfig = {
  isProduction: env('NODE_ENV') === 'production',
  isStaging: env('NODE_ENV') === 'staging',
  isDevelopment: env('NODE_ENV') === 'development',
  port: Number(env('APP_PORT')) || 3000,
  url: env('APP_URL'),
  origins: env('APP_ORIGINS')?.split(',') || ['http://localhost:3000'],
  module: env('APP_MODULE') || 'all',
  firebase: {
    clientEmail: env('FIREBASE_CLIENT_EMAIL') || undefined,
    privateKey: env('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n') || undefined,
    projectId: env('FIREBASE_PROJECT_ID') || undefined,
    apiKey: env('FIREBASE_API_KEY') || undefined,
  }
};
