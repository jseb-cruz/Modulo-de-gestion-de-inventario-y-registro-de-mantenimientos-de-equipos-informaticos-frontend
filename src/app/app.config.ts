import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEquipmentRepository } from './infrastructure/equipment';
import { provideMaintenanceRepository } from './infrastructure/maintenance';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { APP_CONFIG } from './core/config/app-config.token';
import { environment } from '../enviroments/enviroment';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiUrlInterceptor } from './core/http/api-url-interceptor';
import { provideLocationRepository } from './infrastructure/location';
import { provideUserRepository } from './infrastructure/user';
import { authTokenInterceptor } from './core/http/auth-token.interceptor';

// Configuracion global de la aplicacion: registra rutas, repositorios e interceptores HTTP.
export const appConfig: ApplicationConfig = {
  providers: [
    // Captura de errores en navegador antes de que lleguen al handler global.
    provideBrowserGlobalErrorListeners(),
    // Signals sin zone.js para cambio de deteccion mas liviano.
    provideZonelessChangeDetection(),
    // Router standalone con las rutas definidas en app.routes.ts.
    provideRouter(routes),
    // Hidratacion del DOM para SSR.
    provideClientHydration(withEventReplay()),
    // Repositorios seleccionados segun config (HTTP o fake).
    provideEquipmentRepository(),
    provideMaintenanceRepository(),
    provideLocationRepository(),
    provideUserRepository(),
    // Cliente HTTP con fetch y los dos interceptores de URL y token.
    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor, authTokenInterceptor])
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
