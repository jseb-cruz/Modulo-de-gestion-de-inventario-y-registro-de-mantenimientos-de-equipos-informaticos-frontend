import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaintenanceTable } from '../../components/maintenance-table/maintenance-table';
import { MaintenanceStore } from '../../state/maintenance.store';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label-pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';
import { EquipmentStore } from '../../../equipment/state/equipment.store';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, MaintenanceTable, RouterLink, TypeLabelPipe, StatusLabelPipe],
  templateUrl: './maintenance-list.page.html',
  styleUrls: ['./maintenance-list.page.css']
})
export class MaintenanceListPage {
  private readonly store = inject(MaintenanceStore);
  private readonly equipmentStore = inject(EquipmentStore);
  loading = this.store.loading;
  error = this.store.error;
  items = this.store.items;
  paged = this.store.paged;
  total = this.store.total;
  page = this.store.page;
  pageSize = this.store.pageSize;
  equipmentMap = computed(() => {
    const map = new Map<string, string>();
    this.equipmentStore.items().forEach(eq => {
      map.set(eq.id, `${eq.assetTag} - ${eq.model}`);
    });
    return map;
  });
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  statuses = ['Active', 'Inactive', 'InProgress', 'Done', 'Scheduled'] as const;
  types = ['Inspection', 'Preventive', 'Corrective', 'Predictive', 'Proactive', 'Reactive', 'Scheduled', 'Automated'] as const;

  ngOnInit() {
    this.store.fetchAll();
    if (this.equipmentStore.items().length === 0) {
      this.equipmentStore.fetchAll();
    }
  }
  reload() { this.store.fetchAll(); }
  onQuery(event: Event) { this.store.setQuery((event.target as HTMLInputElement).value); }
  onStatus(event: Event) { this.store.setStatus((event.target as HTMLSelectElement).value as any); }
  onType(event: Event) { this.store.setType((event.target as HTMLSelectElement).value as any); }
  onPageSize(event: Event) { this.store.setPageSize(parseInt((event.target as HTMLSelectElement).value, 10)); }
  previous() { this.store.setPage(Math.max(1, this.page() - 1)); }
  next() { this.store.setPage(Math.min(this.totalPages(), this.page() + 1)); }
}
