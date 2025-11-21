
import { Location } from "../models/location.model";
import { LocationDTO } from "../../shared/contracts/location.contract";

export abstract class LocationRepository {
    abstract findAll(): Promise<Location[]>;
    abstract findById(id: string): Promise<Location | null>;
    abstract create(input: LocationDTO): Promise<Location>;
    abstract update(id: string, input: Partial<LocationDTO>): Promise<Location>;
    abstract remove(id: string): Promise<void>;

}