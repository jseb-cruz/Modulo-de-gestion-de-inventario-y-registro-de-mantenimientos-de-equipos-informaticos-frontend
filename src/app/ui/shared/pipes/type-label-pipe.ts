import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'typeLabel',
  standalone: true,
})
export class TypeLabelPipe implements PipeTransform {
  transform(value: string, entity: 'equipment' | 'maintenance' | 'location' = 'equipment'): string {
    const equipmentMap: Record<string, string> = {
      Laptop: 'Portátil',
      Desktop: 'Escritorio',
      Printer: 'Impresora',
      Monitor: 'Monitor',
      Server: 'Servidor',
      Other: 'Otro',
    };
    const maintenanceMap: Record<string, string> = {
      Inspection: 'Inspección',
      Preventive: 'Preventivo',
      Corrective: 'Correctivo',
      Predictive: 'Predictivo',
      Proactive: 'Proactivo',
      Reactive: 'Reactivo',
      Scheduled: 'Programado',
      Automated: 'Automatizado',
    };
    const locationMap: Record<string, string> = {
      Office: 'Oficina',
      Warehouse: 'Almacen',
      DataCenter: 'Centro de datos',
      Lab: 'Laboratorio',
      Remote: 'Remoto',
      Other: 'Otro',
    };
    const map = entity === 'maintenance'
      ? maintenanceMap
      : entity === 'location'
        ? locationMap
        : equipmentMap;

    return map[value] ?? value;
  }
}
