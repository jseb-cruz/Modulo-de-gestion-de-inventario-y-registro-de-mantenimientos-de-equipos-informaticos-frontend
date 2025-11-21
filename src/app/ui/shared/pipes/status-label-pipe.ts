import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: string, entity: 'equipment' | 'maintenance' | 'location' = 'equipment'): string {
    const equipmentMap: Record<string, string> = {
      Available: 'Disponible',
      InUse: 'En uso',
      InRepair: 'En reparación',
      Retired: 'Retirado',
    };
    const maintenanceMap: Record<string, string> = {
      Active: 'Activo',
      Inactive: 'Inactivo',
      InProgress: 'En progreso',
      Done: 'Completado',
      Scheduled: 'Programado',
    };
    const locationMap: Record<string, string> = {
      Active: 'Activo',
      Inactive: 'Inactivo',
      UnderMaintenance: 'En mantenimiento',
      Deprecated: 'Deprecado',
    };

    const map = entity === 'maintenance'
      ? maintenanceMap
      : entity === 'location'
        ? locationMap
        : equipmentMap;
    return map[value] ?? value;
  }
}
