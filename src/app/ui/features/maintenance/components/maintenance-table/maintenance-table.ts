import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maintenance } from '../../../../../domain/models/maintenance.model';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-maintenance-table',
  standalone: true,
  imports: [CommonModule, TypeLabelPipe, StatusLabelPipe, RouterLink],
  template: `
  <table class="w-full border-separate border-spacing-x-6 border-spacing-y-2 text-sm md:text-base">
    <thead>
      <tr>
        <th class="th">Equipo</th>
        <th class="th">Técnico</th>
        <th class="th">Tipo</th>
        <th class="th">Estado</th>
        <th class="th text-right">Detalles</th>
      </tr>
    </thead>
    <tbody>
      @for(item of data; track item.id) {
      <tr>
        <td class="td">{{ equipmentMap?.get(item.equipmentId) ?? item.equipmentId }}</td>
        <td class="td">{{ item.technician }}</td>
        <td class="td">{{ item.type | typeLabel:'maintenance' }}</td>
        <td class="td">{{ item.status | statusLabel:'maintenance' }}</td>
        <td class="td text-right">
          <a class="link" [routerLink]="['/maintenance', item.id]">Ver más</a>
        </td>
      </tr>
      }
    </tbody>
  </table>
  `,
  styles: [`
  table {
    border-collapse: separate;
    border-spacing: 12px 10px;
    table-layout: fixed;
  }
  .th {
    padding: 8px 10px;
    text-align: left;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #cbd5e1;
  }
  .td {
    padding: 12px 10px;
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
    word-break: break-word;
  }
  .link {
    color: #34d399;
    font-weight: 600;
    text-decoration: none;
  }
  .link:hover {
    text-decoration: underline;
  }
  `]
})
export class MaintenanceTable {
 @Input() data: Maintenance[] = [];
 @Input() equipmentMap?: Map<string, string>;
}
