import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { EquipmentTable } from '../../components/equipment-table/equipment-table';
import { EquipmentStore } from '../../state/equipment.store';
import { RouterLink } from '@angular/router';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label-pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { LocationStore } from '../../../location/state/location.store';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [CommonModule, EquipmentTable, RouterLink, TypeLabelPipe,
    StatusLabelPipe],
  templateUrl: './equipment-list.page.html',
  styleUrls: ['./equipment-list.page.css']
})

export class EquipmentListPage {
  private readonly store = inject(EquipmentStore);
  private readonly locationStore = inject(LocationStore);
  loading = this.store.loading;
  error = this.store.error;
  items = this.store.items;
  paged = this.store.paged;
  total = this.store.total;
  page = this.store.page;
  pageSize = this.store.pageSize;
  locationMap = computed(() => {
    const map = new Map<string, string>();
    this.locationStore.items().forEach(loc => {
      map.set(loc.id, `${loc.code} - ${loc.name}`);
    });
    return map;
  });
  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.total() / this.pageSize()));
  })

  statuses = ['Available', 'InUse', 'InRepair', 'Retired'] as const;
  types = ['Laptop', 'Desktop', 'Printer', 'Monitor', 'Server', 'Other'] as
    const;

  ngOnInit() {
    this.store.fetchAll();
    if (this.locationStore.items().length === 0) {
      this.locationStore.fetchAll();
    }
  }
  reload() {
    this.store.fetchAll();
  }
  onQuery(event: Event) {
    this.store.setQuery((event.target as HTMLInputElement).value);
  }
  onStatus(event: Event) {
    this.store.setStatus((event.target as HTMLSelectElement).value as any);
  }
  onType(event: Event) {
    this.store.setType((event.target as HTMLSelectElement).value as any);
  }
  onPageSize(event: Event) {
    this.store.setPageSize(parseInt((event.target as HTMLSelectElement).value,
      10));
  }
  previous() {
    this.store.setPage(Math.max(1, this.page() - 1));
  }
  next() {
    this.store.setPage(Math.min(this.totalPages(), this.page() + 1));
  }
}

