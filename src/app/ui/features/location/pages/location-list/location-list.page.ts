import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { LocationStore } from '../../state/location.store';
import { LocationTable } from '../../components/location-table/location-table';
@Component({
 selector: 'app-location-list',
 standalone: true,
 imports: [CommonModule, LocationTable],
 templateUrl: './location-list.page.html',
})
export class LocationListPage implements OnInit {
 private readonly store = inject(LocationStore);
 loading = this.store.loading;
 error = this.store.error;
 items = computed(() => this.store.items());
 ngOnInit() { this.store.fetchAll(); }
 reload() { this.store.fetchAll(); }
}
