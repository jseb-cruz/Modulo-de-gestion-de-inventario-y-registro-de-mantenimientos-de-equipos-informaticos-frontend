import { Maintenance } from '../models/maintenance.model';
import { MaintenanceDTO } from '../../shared/contracts/maintenance.contract';

export abstract class MaintenanceRepository {
    abstract findAll(): Promise<Maintenance[]>;
    abstract findById(id: string): Promise<Maintenance | null>;
    abstract create(input: MaintenanceDTO): Promise<Maintenance>;
    abstract update(id: string, input: Partial<MaintenanceDTO>):
        Promise<Maintenance>;
    abstract remove(id: string): Promise<void>;
}

