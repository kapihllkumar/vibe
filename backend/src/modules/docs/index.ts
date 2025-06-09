import {RoutingControllersOptions} from 'routing-controllers';
import {DocsController} from './DocsController.js';

// Export empty array for controllers since we're handling docs differently
export const docsModuleOptions: RoutingControllersOptions = {
  controllers: [DocsController],
  routePrefix: '',
  defaultErrorHandler: true,
};
