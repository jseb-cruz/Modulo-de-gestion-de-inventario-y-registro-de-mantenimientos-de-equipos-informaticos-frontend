import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Location } from '../../../../../domain/models/location.model';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label-pipe';

@Component({
  selector: 'app-location-table',
  imports: [CommonModule, TypeLabelPipe, StatusLabelPipe],
  templateUrl: './location-table.html',
  styleUrl: './location-table.css'
})
export class LocationTable {
  @Input() data: Location[] = [];
}
