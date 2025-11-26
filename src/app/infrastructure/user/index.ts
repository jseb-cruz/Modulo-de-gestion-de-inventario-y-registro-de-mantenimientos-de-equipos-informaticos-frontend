import { Provider, inject } from "@angular/core";
import { UserRepository } from "../../domain/repositories/user.repository";
import { UserHttpRepository } from "./user-http.repository";

export const provideUserRepository = (): Provider => ({
  provide: UserRepository,
  useFactory: () => inject(UserHttpRepository),
  deps: [UserHttpRepository],
});
