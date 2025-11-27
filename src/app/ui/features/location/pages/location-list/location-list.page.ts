import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LocationStore } from '../../state/location.store';
import { LocationTable } from '../../components/location-table/location-table';
import { RouterLink } from '@angular/router';
import { TypeLabelPipe } from '../../../../shared/pipes/type-label-pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label-pipe';

@Component({
    selector: 'app-location-list',
    standalone: true,
    imports: [CommonModule, LocationTable, RouterLink, TypeLabelPipe, StatusLabelPipe],
    templateUrl: './location-list.page.html',
    styleUrls: []
})
export class LocationListPage {

    private readonly store = inject(LocationStore);

    loading = this.store.loading;
    error = this.store.error;
    items = computed(() => this.store.items());
    paged = this.store.paged;
    total = this.store.total;
    page = this.store.page;
    pageSize = this.store.pageSize;

    totalPages = computed(() => {
        return Math.max(1, Math.ceil(this.total() / this.pageSize()));
    });
    statuses = ['All', 'Active', 'Inactive', 'UnderMaintenance', 'Deprecated'] as const;
    types = ['All', 'Office', 'Warehouse', 'DataCenter', 'Lab', 'Remote', 'Other'] as const;

    ngOnInit() { this.store.fetchAll(); }

    reload() { this.store.fetchAll(); }

    onQuery(event: Event) {
        this.store.setQuery((event.target as HTMLInputElement).value);
    }

    onStatus(event: Event) {
        const value = (event.target as HTMLSelectElement).value as (typeof this.statuses)[number];
        this.store.setStatus(value);
    }

    onType(event: Event) {
        const value = (event.target as HTMLSelectElement).value as (typeof this.types)[number];
        this.store.setType(value);
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


