
import { Location } from "../models/location.model";

export abstract class LocationRepository {
    abstract findAll(): Promise<Location[]>;
    abstract findById(id: string): Promise<Location | null>;
    // abstract create(input: EquipmentDTO): Promise<Equipment>;
    // abstract update(id: string, input: Partial<EquipmentDTO>)Promise<Location>:
    // abstract delete(id: string): Promise<void>;

}