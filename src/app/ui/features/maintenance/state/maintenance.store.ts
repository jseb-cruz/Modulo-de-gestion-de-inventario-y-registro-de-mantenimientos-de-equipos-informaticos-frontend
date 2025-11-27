import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { LoadMaintenanceListUseCase } from '../../../../application/use-cases/maintenance/load-maintenance-list.use-case';
import { Maintenance } from '../../../../domain/models/maintenance.model';
import { CreateMaintenanceUseCase } from '../../../../application/use-cases/maintenance/create-maintenance.use-case';
import { FindMaintenanceByIdUseCase } from '../../../../application/use-cases/maintenance/find-maintenance-by-id.use-case';
import { RemoveMaintenanceUseCase } from '../../../../application/use-cases/maintenance/remove-maintenance.use-case';
import { UpdateMaintenanceUseCase } from '../../../../application/use-cases/maintenance/update-maintenance.use-case';
import { MaintenanceDTO } from '../../../../shared/contracts/maintenance.contract';

type Status = 'Active' | 'Inactive' | 'InProgress' | 'Done' | 'Scheduled' | 'All';
type Type =
    | 'Inspection'
    | 'Preventive'
    | 'Corrective'
    | 'Predictive'
    | 'Proactive'
    | 'Reactive'
    | 'Scheduled'
    | 'Automated'
    | 'All';

@Injectable({ providedIn: 'root' })
export class MaintenanceStore {
    private readonly loadList = inject(LoadMaintenanceListUseCase);

    readonly items = signal<Maintenance[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    // Filtros UI
    readonly query = signal<string>('');
    readonly status = signal<Status>('All');
    readonly type = signal<Type>('All');

    // Paginación
    readonly page = signal<number>(1);
    readonly pageSize = signal<number>(10);
    readonly total = signal<number>(0);

    // Descarga todos los mantenimientos y resetea la pagina.
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
        const q = this.query().toLowerCase();
        const st = this.status();
        const tp = this.type();
        return this.items().filter((m) => {
            const byQuery = !q
                || m.equipmentId.toLowerCase().includes(q)
                || m.technician.toLowerCase().includes(q)
                || (m.notes ? m.notes.toLowerCase().includes(q) : false);
            const byStatus = st === 'All' || m.status === st;
            const byType = tp === 'All' || m.type === tp;
            return byQuery && byStatus && byType;
        });
    });

    readonly paged = computed(() => {
        const data = this.filtered();
        const start = (this.page() - 1) * this.pageSize();
        return data.slice(start, start + this.pageSize());
    });

    // Mantiene actualizado el total al cambiar filtros.
    constructor() {
        effect(() => {
            this.total.set(this.filtered().length);
        });
    }

    // Filtros/paginacion que usa la UI.
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

    private readonly findMaintenanceById = inject(FindMaintenanceByIdUseCase);
    private readonly createMaintenance = inject(CreateMaintenanceUseCase);
    private readonly updateMaintenance = inject(UpdateMaintenanceUseCase);
    private readonly removeMaintenance = inject(RemoveMaintenanceUseCase);

    // Busca mantenimiento en cache o backend.
    async findById(id: string) {
        const cached = this.items().find(e => e.id === id);
        if (cached) return cached;
        this.loading.set(true);
        this.error.set(null);
        try {
            const found = await this.findMaintenanceById.execute(id);
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
            this.error.set(err?.message ?? 'No fue posible obtener el equipo');
            return null;
        } finally {
            this.loading.set(false);
        }
    }
    // Crea mantenimiento y lo agrega al inicio de la lista.
    async create(input: MaintenanceDTO) {
        this.loading.set(true);
        try {
            const created = await this.createMaintenance.execute(input);
            this.items.set([created, ...this.items()]);
        } finally {
            this.loading.set(false);
        }
    }
    // Actualiza mantenimiento y lo reemplaza en memoria.
    async update(id: string, patch: Partial<MaintenanceDTO>) {
        this.loading.set(true);
        try {
            const updated = await this.updateMaintenance.execute(id, patch);
            this.items.set(this.items().map(e => e.id === id ? updated : e));
        } finally {
            this.loading.set(false);
        }
    }
    // Elimina mantenimiento del listado local tras borrar en backend.
    async remove(id: string) {
        this.loading.set(true);
        try {
            await this.removeMaintenance.execute(id);
            this.items.set(this.items().filter(e => e.id !== id));
        } finally {
            this.loading.set(false);
        }
    }
}


