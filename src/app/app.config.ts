import {
  ApplicationConfig, provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEquipmentRepository } from './infrastructure/equipment';
import { provideMaintenanceRepository } from './infrastructure/maintenance';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { APP_CONFIG } from './core/config/app-config.token';
import { environment } from '../enviroments/enviroment';
import { provideHttpClient, withFetch, withInterceptors } from
  '@angular/common/http';
import { apiUrlInterceptor } from './core/http/api-url-interceptor';
import { provideLocationRepository } from './infrastructure/location';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideEquipmentRepository(),
    provideMaintenanceRepository(),
    provideLocationRepository(),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor])
    ),
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: environment.apiUrl,
        useFakeApi: environment.useFakeApi,
      },
    },
  ],
};
