import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config.token';

// Antepone apiUrl a rutas relativas y agrega encabezado identificador.
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const { apiUrl } = inject(APP_CONFIG);
  const isAbsolute = /^https?:\/\//i.test(req.url);
  const url = isAbsolute ? req.url : `${apiUrl.replace(/\/$/, '')}/${req.url.replace(/^\//, '')}`;
  const authReq = req.clone({
    url,
    setHeaders: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  return next(authReq);
};
