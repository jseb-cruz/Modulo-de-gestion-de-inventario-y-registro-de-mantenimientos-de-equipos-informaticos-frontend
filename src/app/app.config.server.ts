import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

/**
 * Keep server providers registered only once to avoid duplicate state serialization warnings.
 * The SSR engine already registers the necessary server providers.
 */
const serverConfig: ApplicationConfig = {
  providers: []
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
