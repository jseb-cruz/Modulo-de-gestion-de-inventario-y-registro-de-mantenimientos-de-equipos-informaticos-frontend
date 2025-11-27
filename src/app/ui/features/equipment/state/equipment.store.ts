import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { LoadEquipmentListUseCase } from '../../../../application/use-cases/equipment/load-equipment-list.use-case';
import { Equipment } from '../../../../domain/models/equipment.model';
import { CreateEquipmentUseCase } from '../../../../application/use-cases/equipment/create-equipment.use-case';
import { FindEquipmentByIdUseCase } from '../../../../application/use-cases/equipment/find-equipment-by-id.use-case';
import { RemoveEquipmentUseCase } from '../../../../application/use-cases/equipment/remove-equipment.use-case';
import { UpdateEquipmentUseCase } from '../../../../application/use-cases/equipment/update-equipment.use-case';
import { EquipmentDTO } from '../../../../shared/contracts/equipment.contract';


type Status = 'Available' | 'InUse' | 'InRepair' | 'Retired' | 'All';
type Type = 'Laptop' | 'Desktop' | 'Printer' | 'Monitor' | 'Server' | 'Other' |
    'All';

@Injectable({
    providedIn: 'root'
})
export class EquipmentStore {
    // Use case para cargar listado completo.
    private readonly loadList = inject(LoadEquipmentListUseCase);
    readonly items = signal<Equipment[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);
    // Filtros UI
    readonly query = signal<string>('');
    readonly status = signal<string>('All');
    readonly type = signal<string>('All');
    // PaginaciÃ³n
    readonly page = signal<number>(1);
    readonly pageSize = signal<number>(10);
    readonly total = signal<number>(0);
    // Obtiene todos los equipos y resetea la pagina actual.
    async fetchAll() {
        this.loading.set(true);
        this.error.set(null);
        try {
            const data = await this.loadList.execute();
            this.items.set(data);
            this.page.set(1)
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
        return this.items().filter(equipment => {
            const byQuery = !query
                || equipment.assetTag.toLowerCase().includes(query)
                || equipment.serialNumber.toLowerCase().includes(query)
                || equipment.model.toLowerCase().includes(query);
            const byStatus = status === 'All' || equipment.status === status;
            const byType = type === 'All' || equipment.type === type;
            return byQuery && byStatus && byType;
        });
    });

    /**
     * The constructor function sets up an effect that updates the total based on the length of the
     * filtered items.
     */
    constructor() {
        effect(() => {
            this.total.set(this.filtered().length);
        });
    }

    readonly paged = computed(() => {
        const data = this.filtered();
        const start = (this.page() - 1) * this.pageSize();
        return data.slice(start, start + this.pageSize());
    });
    // Filtros y paginacion para la UI.
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

    private readonly findEquipmentById = inject(FindEquipmentByIdUseCase);
    private readonly createEquipment = inject(CreateEquipmentUseCase);
    private readonly updateEquipment = inject(UpdateEquipmentUseCase);
    private readonly removeEquipment = inject(RemoveEquipmentUseCase);

    // Busca un equipo por id usando cache local y backend.
    async findById(id: string) {
        const cached = this.items().find(e => e.id === id);
        if (cached) return cached;
        this.loading.set(true);
        this.error.set(null);
        try {
            const found = await this.findEquipmentById.execute(id);
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
    // Crea un equipo y lo agrega al inicio de la lista.
    async create(input: EquipmentDTO) {
        this.loading.set(true);
        try {
            const created = await this.createEquipment.execute(input);
            this.items.set([created, ...this.items()]);
        } finally {
            this.loading.set(false);
        }
    }
    // Actualiza un equipo y reemplaza el item en memoria.
    async update(id: string, patch: Partial<EquipmentDTO>) {
        this.loading.set(true);
        try {
            const updated = await this.updateEquipment.execute(id, patch);
            this.items.set(this.items().map(e => e.id === id ? updated : e));
        } finally {
            this.loading.set(false);
        }
    }
    // Elimina un equipo de la lista tras borrar en backend.
    async remove(id: string) {
        this.loading.set(true);
        try {
            await this.removeEquipment.execute(id);
            this.items.set(this.items().filter(e => e.id !== id));
        } finally {
            this.loading.set(false);
        }
    }
}





