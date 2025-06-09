import {ContainerModule} from 'inversify';
import {AUTH_TYPES} from './types.js';
import {FirebaseAuthService} from './services/FirebaseAuthService.js';
import {AuthController} from './controllers/AuthController.js';

export const authContainerModule = new ContainerModule(options => {
  // Services
  options
    .bind(AUTH_TYPES.AuthService)
    .to(FirebaseAuthService)
    .inSingletonScope();

  // Controllers
  options.bind(AuthController).toSelf().inSingletonScope();
});
