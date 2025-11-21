import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { LoadLocationListUseCase } from '../../../../application/use-cases/location/load-location-list.use-case';
import { CreateLocationUseCase } from '../../../../application/use-cases/location/create-location.use-case';
import { FindLocationByIdUseCase } from '../../../../application/use-cases/location/find-location-by-id.use-case';
import { UpdateLocationUseCase } from '../../../../application/use-cases/location/update-location.use-case';
import { RemoveLocationUseCase } from '../../../../application/use-cases/location/remove-location.use-case';
import { Location } from '../../../../domain/models/location.model';
import { LocationDTO } from '../../../../shared/contracts/location.contract';

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

    private readonly findLocationById = inject(FindLocationByIdUseCase);
    private readonly createLocation = inject(CreateLocationUseCase);
    private readonly updateLocation = inject(UpdateLocationUseCase);
    private readonly removeLocation = inject(RemoveLocationUseCase);

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

    async findById(id: string) {
        const cached = this.items().find(e => e.id === id);
        if (cached) return cached;
        this.loading.set(true);
        this.error.set(null);
        try {
            const found = await this.findLocationById.execute(id);
            if (found) {
                const exists = this.items().some(e => e.id === found.id);
                this.items.set(
                    exists
                        ? this.items().map(e => e.id === found.id ? found : e)
                        : [found, ...this.items()]
                );
            }
            return found ?? null;
        } catch (err: any) {
            this.error.set(err?.message ?? 'No fue posible obtener la ubicacion');
            return null;
        } finally {
            this.loading.set(false);
        }
    }
    async create(input: LocationDTO) {
        this.loading.set(true);
        try {
            const created = await this.createLocation.execute(input);
            this.items.set([created, ...this.items()]);
        } finally {
            this.loading.set(false);
        }
    }
    async update(id: string, patch: Partial<LocationDTO>) {
        this.loading.set(true);
        try {
            const updated = await this.updateLocation.execute(id, patch);
            this.items.set(this.items().map(e => e.id === id ? updated : e));
        } finally {
            this.loading.set(false);
        }
    }
    async remove(id: string) {
        this.loading.set(true);
        try {
            await this.removeLocation.execute(id);
            this.items.set(this.items().filter(e => e.id !== id));
        } finally {
            this.loading.set(false);
        }
    }
}

