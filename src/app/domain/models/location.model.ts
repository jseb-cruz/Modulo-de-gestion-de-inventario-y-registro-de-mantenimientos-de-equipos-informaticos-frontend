import { LocationDTO } from '../../shared/contracts/location.contract';

export type LocationType =
    'Office' | 'Warehouse' | 'DataCenter' | 'Lab' | 'Remote' | 'Other';

export type LocationStatus =
    'Active' | 'Inactive' | 'UnderMaintenance' | 'Deprecated';

export class Location {
    constructor(
        public readonly id: string,
        public readonly code: string,
        public readonly name: string,
        public readonly type: LocationType,
        public readonly status: LocationStatus,
        public readonly building?: string,
        public readonly floor?: string,
        public readonly room?: string,
        public readonly address?: string,
        public readonly metadata: Map<string, unknown> = new Map(),
    ) { }

    static create(input: LocationDTO) {
        if (!input.code?.trim()) throw new Error('code vacio');
        if (!input.name?.trim()) throw new Error('name vacio');
        const meta = input.metadata instanceof Map
            ? input.metadata
            : new Map(Object.entries(input.metadata ?? {}));
        return new Location(
            input.id,
            input.code,
            input.name,
            input.type,
            input.status ?? 'Active',
            input.building,
            input.floor,
            input.room,
            input.address,
            meta,
        );
    }

    isActive(): boolean {
        return this.status === 'Active';
    }
    isInactive(): boolean {
        return this.status === 'Inactive';
    }

    isUnderMaintenance(): boolean {
        return this.status === 'UnderMaintenance';
    }

    isDeprecated(): boolean {
        return this.status === 'Deprecated';
    }
}
