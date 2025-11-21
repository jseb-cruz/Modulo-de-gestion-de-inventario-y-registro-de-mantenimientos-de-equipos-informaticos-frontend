import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocationRepository } from '../../../../domain/repositories/location.repository';
export const locationExistsGuard: CanActivateFn = async (route, state) => {
  const repo = inject(LocationRepository);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) return router.createUrlTree(['/location']);
  try {
    const found = await repo.findById(id);
    return !!found || router.createUrlTree(['/location']);
  } catch {
    return router.createUrlTree(['/location']);
  }
};
