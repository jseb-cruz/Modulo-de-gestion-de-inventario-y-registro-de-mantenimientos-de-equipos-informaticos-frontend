import { LocationStatus, LocationType } from "../../domain/models/location.model";

export interface LocationDTO {
    id: string;
    code: string;
    name: string;
    type: LocationType;
    status: LocationStatus;
    building?: string;
    floor?: string;
    room?: string;
    address?: string;
    metadata?: Record<string, unknown> | Map<string, unknown>;
}
