import { Provider,inject } from "@angular/core";
import { APP_CONFIG } from "../../core/config/app-config.token";
import { LocationRepository } from "../../domain/repositories/location.repository";
import { LocationHttpRepository } from "./location-http.repository";
import { LocationFakeRepository } from "./location-http.fake.repository";

export const provideLocationRepository = (): Provider => ({
    provide: LocationRepository,
    useFactory: () => {
        const cfg = inject(APP_CONFIG);
        return cfg.useFakeApi ? inject(LocationFakeRepository) : inject(
            LocationHttpRepository);
    },
    deps: [APP_CONFIG, LocationHttpRepository, LocationFakeRepository]
});