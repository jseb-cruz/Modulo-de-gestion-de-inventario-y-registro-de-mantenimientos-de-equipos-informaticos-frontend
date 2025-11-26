import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Equipment } from '../../../../../domain/models/equipment.model';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipment-table',
  standalone: true,
  imports: [CommonModule, TypeLabelPipe, StatusLabelPipe, RouterLink],
  templateUrl: './equipment-table.html',
  styleUrls: ['./equipment-table.css']
})
export class EquipmentTable {
  @Input() data: Equipment[] = [];
  @Input() locationMap?: Map<string, string>;
}
