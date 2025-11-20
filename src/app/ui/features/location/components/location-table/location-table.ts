import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Location } from '../../../../../domain/models/location.model';
@Component({
  selector: 'app-location-table',
  imports: [CommonModule],
  templateUrl: './location-table.html',
  styleUrl: './location-table.css'
})
export class LocationTable {
  @Input() data: Location[] = [];
}
