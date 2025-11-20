import { Routes } from '@angular/router';
import { equipmentExistsGuard } from './ui/features/equipment/guards/equipment-exists-guard';
import { equipmentListResolver } from
    './ui/features/equipment/resolvers/equipment-list-resolver';
import { maintenanceExistsGuard } from './ui/features/maintenance/guards/maintenance-exists-guard';
import { maintenanceListResolver } from './ui/features/maintenance/resolvers/maintenance-list-resolver';
import { Shell } from './ui/layout/shell/shell';
export const routes: Routes = [
    {
        path: '',
        component: Shell,
        children: [
            {
                path: 'equipment',
                loadComponent: () => import(
                    './ui/features/equipment/pages/equipment-list/equipment-list.page').then(m =>
                        m.EquipmentListPage),
                resolve: { preload: equipmentListResolver }
            },
            {
                path: 'equipment/new',
                loadComponent: () => import(
                    './ui/features/equipment/pages/equipment-form/equipment-form.page').then(m =>
                        m.EquipmentFormPage)
            },
            {
                path: 'equipment/:id',
                loadComponent: () => import(
                    './ui/features/equipment/pages/equipment-detail/equipment-detail.page').then(
                        m => m.EquipmentDetailPage)
            },
            {
                path: 'equipment/:id/edit',
                canActivate: [equipmentExistsGuard],
                loadComponent: () => import('./ui/features/equipment/pages/equipment-form/equipment-form.page').then(m => m.EquipmentFormPage),
            },
            { path: '', redirectTo: 'equipment', pathMatch: 'full' },
        ],
    },
    {
        path: 'location',
        loadComponent: () => import(
            './ui/features/location/pages/location-list/location-list.page').then(m =>
                m.LocationListPage)
    },
    {
        path: 'location/new',
        loadComponent: () => import(
            './ui/features/location/pages/location-form/location-form.page').then(m =>
                m.LocationFormPage)
    },
    {
        path: 'location/:id',
        loadComponent: () => import(
            './ui/features/location/pages/location-detail/location-detail.page').then(m =>
                m.LocationDetailPage)
    },
    {
        path: 'maintenance',
        loadComponent: () => import(
            './ui/features/maintenance/pages/maintenance-list/maintenance-list.page').then(m =>
                m.MaintenanceListPage),
        resolve: { preload: maintenanceListResolver }
    },
    {
        path: 'maintenance/new',
        loadComponent: () => import(
            './ui/features/maintenance/pages/maintenance-form/maintenance-form.page').then(m =>
                m.MaintenanceFormPage)
    },
    {
        path: 'maintenance/:id',
        loadComponent: () => import(
            './ui/features/maintenance/pages/maintenance-detail/maintenance-detail.page').then(
                m => m.MaintenanceDetailPage)
    },
    {
        path: 'maintenance/:id/edit',
        canActivate: [maintenanceExistsGuard],
        loadComponent: () => import('./ui/features/maintenance/pages/maintenance-form/maintenance-form.page').then(m => m.MaintenanceFormPage),
    },
    { path: '', pathMatch: 'full', redirectTo: 'equipment' },
    { path: '**', redirectTo: 'equipment' },
];



