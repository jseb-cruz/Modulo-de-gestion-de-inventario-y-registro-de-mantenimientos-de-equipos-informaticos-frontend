import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../../../../domain/models/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  template: `
  <table class="w-full border-separate border-spacing-x-6 border-spacing-y-2 text-sm md:text-base">
    <thead>
      <tr>
        <th class="th">Nombre</th>
        <th class="th">Email</th>
        <th class="th">Rol</th>
        <th class="th">Estado</th>
        @if(showActions){
        <th class="th text-right">Acciones</th>
        }
      </tr>
    </thead>
    <tbody>
      @for(user of data; track user.id) {
      <tr>
        <td class="td">{{ user.name }}</td>
        <td class="td">{{ user.email }}</td>
        <td class="td">{{ user.role }}</td>
        <td class="td">{{ user.status }}</td>
        @if(showActions){
        <td class="td text-right space-x-2">
          <button type="button" (click)="onEdit?.(user)" class="btn secondary">Editar</button>
          <button type="button" (click)="onDelete?.(user)" class="btn danger">Eliminar</button>
        </td>
        }
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
  .btn {
    border-radius: 10px;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 12px;
    border: 1px solid transparent;
    cursor: pointer;
  }
  .btn.secondary {
    background: rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
    border-color: rgba(255, 255, 255, 0.12);
  }
  .btn.danger {
    background: rgba(248, 113, 113, 0.15);
    color: #fecdd3;
    border-color: rgba(248, 113, 113, 0.35);
  }
  .btn:hover {
    filter: brightness(1.05);
  }
  `]
})
export class UserTable {
  @Input() data: User[] = [];
  @Input() showActions = false;
  @Input() onEdit?: (user: User) => void;
  @Input() onDelete?: (user: User) => void;
}
