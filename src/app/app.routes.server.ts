import { RenderMode, ServerRoute } from '@angular/ssr';

const prerenderPaths = [
  'login',
  'hub',
  'change-password',
  'equipment',
  'equipment/new',
  'users',
  'users/new',
  'location',
  'location/new',
  'maintenance',
  'maintenance/new',
];

const prerenderRoutes: ServerRoute[] = prerenderPaths.map((path) => ({
  path,
  renderMode: RenderMode.Prerender,
}));

export const serverRoutes: ServerRoute[] = [
  ...prerenderRoutes,
  { path: 'equipment/:id', renderMode: RenderMode.Server },
  { path: 'equipment/:id/edit', renderMode: RenderMode.Server },
  { path: 'users/:id/edit', renderMode: RenderMode.Server },
  { path: 'location/:id', renderMode: RenderMode.Server },
  { path: 'location/:id/edit', renderMode: RenderMode.Server },
  { path: 'maintenance/:id', renderMode: RenderMode.Server },
  { path: 'maintenance/:id/edit', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
