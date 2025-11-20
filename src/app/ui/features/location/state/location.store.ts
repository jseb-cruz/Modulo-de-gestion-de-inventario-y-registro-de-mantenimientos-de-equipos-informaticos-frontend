import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LoadLocationListUseCase } from '../../../../application/use-cases/location/load-location-list.use-case';
import { Location } from '../../../../domain/models/location.model';

type Status = 'Active' | 'Inactive' | 'UnderMaintenance' | 'Deprecated' | 'All';
type Type = 'Office' | 'Warehouse' | 'DataCenter' | 'Lab' | 'Remote' | 'Other' | 'All';

@Injectable({
    providedIn: 'root'
})
export class LocationStore {
    private readonly loadList = inject(LoadLocationListUseCase);
    readonly items = signal<Location[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    readonly query = signal<string>('');
    readonly status = signal<Status>('All');
    readonly type = signal<Type>('All');

    readonly page = signal<number>(1);
    readonly pageSize = signal<number>(10);
    readonly total = signal<number>(0);

    async fetchAll() {
        this.loading.set(true);
        this.error.set(null);
        try {
            const data = await this.loadList.execute();
            this.items.set(data);
            this.page.set(1);
        } catch (err: any) {
            this.error.set(err?.message ?? 'Unexpected error');
        } finally {
            this.loading.set(false);
        }
    }

    readonly filtered = computed(() => {
        const query = this.query().toLowerCase();
        const status = this.status();
        const type = this.type();
        return this.items().filter(location => {
            const byQuery = !query
                || location.code.toLowerCase().includes(query)
                || location.name.toLowerCase().includes(query)
                || (location.address ?? '').toLowerCase().includes(query)
                || (location.building ?? '').toLowerCase().includes(query)
                || (location.room ?? '').toLowerCase().includes(query);
            const byStatus = status === 'All' || location.status === status;
            const byType = type === 'All' || location.type === type;
            return byQuery && byStatus && byType;
        });
    });

    readonly paged = computed(() => {
        const data = this.filtered();
        const start = (this.page() - 1) * this.pageSize();
        return data.slice(start, start + this.pageSize());
    });

    constructor() {
        effect(() => {
            this.total.set(this.filtered().length);
        });
    }

    setQuery(query: string) {
        this.query.set(query);
        this.page.set(1);
    }

    setStatus(status: Status) {
        this.status.set(status);
        this.page.set(1);
    }

    setType(type: Type) {
        this.type.set(type);
        this.page.set(1);
    }

    setPage(page: number) {
        this.page.set(page);
    }

    setPageSize(n: number) {
        this.pageSize.set(n);
        this.page.set(1);
    }
}
