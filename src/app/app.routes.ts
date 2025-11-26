import { Routes } from '@angular/router';
import { equipmentExistsGuard } from './ui/features/equipment/guards/equipment-exists-guard';
import { equipmentListResolver } from
    './ui/features/equipment/resolvers/equipment-list-resolver';
import { maintenanceExistsGuard } from './ui/features/maintenance/guards/maintenance-exists-guard';
import { maintenanceListResolver } from './ui/features/maintenance/resolvers/maintenance-list-resolver';
import { Shell } from './ui/layout/shell/shell';
import { locationExistsGuard } from './ui/features/location/guards/location-exists-guard';
import { adminGuard } from './ui/auth/admin.guard';
import { authGuard } from './ui/auth/auth.guard';
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'login',
        loadComponent: () => import('./ui/auth/login/login.page').then(m => m.LoginPage),
    },
    {
        path: '',
        component: Shell,
        canActivateChild: [authGuard],
        children: [
            {
                path: 'equipment',
                canActivate: [authGuard],
                loadComponent: () => import(
                    './ui/features/equipment/pages/equipment-list/equipment-list.page').then(m =>
                        m.EquipmentListPage),
                resolve: { preload: equipmentListResolver }
            },
            {
                path: 'equipment/new',
                canActivate: [authGuard, adminGuard],
                loadComponent: () => import(
                    './ui/features/equipment/pages/equipment-form/equipment-form.page').then(m =>
                        m.EquipmentFormPage)
            },
            {
                path: 'equipment/:id',
                canActivate: [authGuard],
                loadComponent: () => import(
                    './ui/features/equipment/pages/equipment-detail/equipment-detail.page').then(
                        m => m.EquipmentDetailPage)
            },
            {
                path: 'equipment/:id/edit',
                canActivate: [authGuard, equipmentExistsGuard, adminGuard],
                loadComponent: () => import('./ui/features/equipment/pages/equipment-form/equipment-form.page').then(m => m.EquipmentFormPage),
            },
            {
                path: 'users',
                canActivate: [authGuard, adminGuard],
                loadComponent: () => import('./ui/features/user/pages/user-list/user-list.page').then(m => m.UserListPage),
            },
            {
                path: 'users/new',
                canActivate: [authGuard, adminGuard],
                loadComponent: () => import('./ui/features/user/pages/user-form/user-form.page').then(m => m.UserFormPage),
            },
            {
                path: 'users/:id/edit',
                canActivate: [authGuard, adminGuard],
                loadComponent: () => import('./ui/features/user/pages/user-form/user-form.page').then(m => m.UserFormPage),
            },
            { path: '', redirectTo: 'hub', pathMatch: 'full' },
        ],
    },
    {
        path: 'hub',
        canActivate: [authGuard],
        loadComponent: () => import('./ui/features/home/module-hub.page').then(m => m.ModuleHubPage),
    },
    {
        path: 'change-password',
        canActivate: [authGuard],
        loadComponent: () => import('./ui/auth/change-password/change-password.page').then(m => m.ChangePasswordPage),
    },
    {
        path: 'location',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import(
            './ui/features/location/pages/location-list/location-list.page').then(m =>
                m.LocationListPage)
    },
    {
        path: 'location/new',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import(
            './ui/features/location/pages/location-form/location-form.page').then(m =>
                m.LocationFormPage)
    },
    {
        path: 'location/:id',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import(
            './ui/features/location/pages/location-detail/location-detail.page').then(m =>
                m.LocationDetailPage)
    },
    {
        path: 'location/:id/edit',
        canActivate: [authGuard, locationExistsGuard, adminGuard],
        loadComponent: () => import('./ui/features/location/pages/location-form/location-form.page').then(m => m.LocationFormPage),
    },
    {
        path: 'maintenance',
        canActivate: [authGuard],
        loadComponent: () => import(
            './ui/features/maintenance/pages/maintenance-list/maintenance-list.page').then(m =>
                m.MaintenanceListPage),
        resolve: { preload: maintenanceListResolver }
    },
    {
        path: 'maintenance/new',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import(
            './ui/features/maintenance/pages/maintenance-form/maintenance-form.page').then(m =>
                m.MaintenanceFormPage)
    },
    {
        path: 'maintenance/:id',
        canActivate: [authGuard],
        loadComponent: () => import(
            './ui/features/maintenance/pages/maintenance-detail/maintenance-detail.page').then(
                m => m.MaintenanceDetailPage)
    },
    {
        path: 'maintenance/:id/edit',
        canActivate: [authGuard, maintenanceExistsGuard, adminGuard],
        loadComponent: () => import('./ui/features/maintenance/pages/maintenance-form/maintenance-form.page').then(m => m.MaintenanceFormPage),
    },
    { path: '**', redirectTo: 'login' },
];



