# Documentacion completa del frontend (Angular 20)

Este archivo resume que contiene cada archivo TypeScript y que hace cada metodo expuesto en el frontend. Se agrupa por carpeta para poder ubicar rapido la logica.

## Entradas y bootstrap
- `src/main.ts`: arranca la SPA con `bootstrapApplication(App, appConfig)` y captura errores en consola.
- `src/main.server.ts`: define `bootstrap` que arranca la app para SSR usando `app.config.server.ts`; export default usado por Angular SSR.
- `src/server.ts`: servidor Express para SSR. Crea `app`, sirve estaticos de `/browser`, deriva peticiones al motor `AngularNodeAppEngine` y exporta `reqHandler`. El bloque `if (isMainModule)` levanta el server en `PORT|4000`.

## Configuracion y rutas base
- `src/app/app.ts`: componente raiz `App`; expone signal `title` y renderiza `<router-outlet>`.
- `src/app/app.html` / `app.css`: plantilla y estilos minimos del shell raiz.
- `src/app/app.config.ts`: `appConfig` registra router (`routes`), hidratacion, interceptores HTTP, providers de repositorios (equipment/location/maintenance/user) y el token `APP_CONFIG` con `apiUrl` y `useFakeApi`.
- `src/app/app.config.server.ts`: combina `appConfig` con `serverConfig` (providers vacios) para evitar duplicados en SSR; exporta `config`.
- `src/app/app.routes.ts`: constante `routes` que define todas las rutas SPA, con guards `authGuard` y `adminGuard`, resolvers de listas y redirects a login/hub.
- `src/app/app.routes.server.ts`: `serverRoutes` para prerender/SSR; lista rutas a prerender y las dinamicas que quedan en modo server.
- `src/app/app.routes.server.ts`: se usan `RenderMode.Prerender` y `RenderMode.Server` para cada ruta especifica; incluye wildcard `**`.
- `src/app/app.spec.ts`: test de scaffold que asegura que el componente App se crea correctamente.

## Core (config, errores, HTTP)
- `src/app/core/config/app-config.token.ts`: define la interfaz `AppConfig` (apiUrl, useFakeApi) y el injection token `APP_CONFIG`.
- `src/app/core/errors/error-mapper.ts`: servicio `ErrorMapper` con metodo `toMessage(error)` que normaliza cualquier error a un string legible.
- `src/app/core/errors/global-error.handler.ts`: placeholder para manejador global de errores (sin implementacion actualmente).
- `src/app/core/http/api-url-interceptor.ts`: interceptor `apiUrlInterceptor(req, next)` que antepone `apiUrl` a rutas relativas y agrega header `X-Requested-With`.
- `src/app/core/http/auth-token.interceptor.ts`: interceptor `authTokenInterceptor(req, next)` que agrega `Authorization: Bearer <token>` si `AuthService` tiene token.

## Entornos
- `src/enviroments/environment.development.ts`, `environment.production.ts`, `enviroment.ts`: exportan constantes `environment` con flags `production`, `apiUrl`, `useFakeApi`.

## Dominio (modelos y repositorios)
- `src/app/domain/models/equipment.model.ts`: clase `Equipment` con fabrica estatica `create(input)` que valida campos y mapea metadata; metodos `isActive()` y `canBeMaintained()`.
- `src/app/domain/models/location.model.ts`: clase `Location` con `create(input)` que valida code/name y convierte metadata; metodos `isActive()`, `isInactive()`, `isUnderMaintenance()`, `isDeprecated()`.
- `src/app/domain/models/maintenance.model.ts`: clase `Maintenance` con `create(input)` que castea fechas; metodo `isCompleted()` indica estado Done.
- `src/app/domain/models/user.model.ts`: clase `User` con fabrica `create(props)` que normaliza metadata; metodo `isActive()`.
- `src/app/domain/repositories/*.repository.ts`: interfaces para cada agregado (equipment/location/maintenance/user) con metodos `findAll`, `findById`, `create`, `update`, `remove` que describen los contratos usados por los casos de uso.

## Casos de uso (application/use-cases)
Cada caso de uso es un servicio injectable con metodo `execute`:
- Equipment: `create-equipment.use-case.ts` (llama repo.create), `find-equipment-by-id.use-case.ts` (repo.findById), `load-equipment-list.use-case.ts` (repo.findAll), `remove-equipment.use-case.ts` (repo.remove), `update-equipment.use-case.ts` (repo.update).
- Location: `create-location.use-case.ts`, `find-location-by-id.use-case.ts`, `load-location-list.use-case.ts`, `remove-location.use-case.ts`, `update-location.use-case.ts` (mismos patrones de llamado a repositorio).
- Maintenance: `create-maintenance.use-case.ts`, `find-maintenance-by-id.use-case.ts`, `load-maintenance-list.use-case.ts`, `remove-maintenance.use-case.ts`, `update-maintenance.use-case.ts`.
- User: `create-user.use-case.ts`, `find-user-by-id.use-case.ts`, `load-user-list.use-case.ts`, `remove-user.use-case.ts`, `update-user.use-case.ts`.

## Infraestructura (adaptadores HTTP / fake)
- `infrastructure/*/index.ts`: funciones `provide<Aggregate>Repository()` que eligen repo HTTP o fake segun `APP_CONFIG.useFakeApi`.
- Equipment: `equipment-http.repository.ts` usa `HttpClient`; helpers `unwrapList`/`unwrapOne`; metodos `findAll`, `findById`, `create`, `update`, `remove` retornan modelos `Equipment`. `equipment-http.fake.repository.ts` mantiene arreglo local y simula latencia con mismos metodos CRUD.
- Location: `location-http.repository.ts` y `location-http.fake.repository.ts` siguen el mismo esquema para `Location`; incluyen unwrap de respuestas y CRUD.
- Maintenance: `maintenance-http.repository.ts` y `maintenance-http.fake.repository.ts` manejan CRUD de `Maintenance`.
- User: `user-http.repository.ts` implementa CRUD y desempaqueta `{ ok, data }`; maneja `password` en `create`/`update`. `user-http.fake.repository.ts` no existe (solo repo real).

## Shared (contracts y utilidades)
- `shared/contracts/*.contract.ts`: tipos DTO para cada agregado; sin metodos.
- `shared/utils/metadata.util.ts`: funcion `toRecord(mapOrObj)` que convierte `Map` a `Record` plano para formularios/serializacion.

## Autenticacion (ui/auth)
- `auth.service.ts`: gestiona sesion. Metodos: `setSession(token, user)` guarda en signals y localStorage; `clear()` borra todo y navega a login; `isAuthenticated()` valida token; `isAdmin()` revisa rol.
- `auth.guard.ts`: `authGuard` permite acceso solo si hay token, si no redirige a `/login`.
- `admin.guard.ts`: `adminGuard` permite acceso solo con rol Admin, si no redirige a `/login`.
- `login/login.page.ts`: componente standalone de login. Metodos: `onSubmit()` toma credentials del form, hace `POST auth/login`, guarda sesion en `AuthService`, maneja errores y navega a `/hub`.
- `change-password/change-password.page.ts`: componente para cambiar clave. Metodos: `ngOnInit()` precarga userId de query params; `onSubmit()` envia patch con `currentPassword` y `newPassword` y resetea formulario o muestra error.

## Layout
- `ui/layout/shell/shell.ts`: componente `Shell` que envuelve las rutas protegidas; metodos `logout()` (llama `AuthService.clear()`), `isAdmin()` y `isAuthenticated()` para la vista. `shell.html/css` definen layout basico.

## Home
- `ui/features/home/module-hub.page.ts`: componente de dashboard; no tiene metodos adicionales mas alla de la definicion del componente (usa datos estaticos para tarjetas).

## Features: Equipment
- `state/equipment.store.ts`: store con signals. Metodos: `fetchAll()` carga lista via caso de uso; setters `setQuery`, `setStatus`, `setType`, `setPage`, `setPageSize`; `findById(id)` con cache; `create(input)`, `update(id, patch)`, `remove(id)` actualizan `items`. Computados `filtered`, `paged`, `total`.
- `guards/equipment-exists-guard.ts`: guard que usa `EquipmentStore.findById` para permitir edicion solo si el equipo existe.
- `resolvers/equipment-list-resolver.ts`: `equipmentListResolver` precarga lista llamando `EquipmentStore.fetchAll()`.
- `components/equipment-table/equipment-table.ts`: componente tabla; Inputs `data`, `locationMap`; metodos `rowLocation(id)` para mostrar ubicacion y `statusClass(status)` para estilos.
- `pages/equipment-list/equipment-list.page.ts`: pagina de listado. Metodos: `ngOnInit()` carga equipos y ubicaciones; `reload()` refresca; handlers `onQuery/onStatus/onType/onPageSize`; paginacion `previous/next`; computed `totalPages`, `locationMap`.
- `pages/equipment-detail/equipment-detail.page.ts`: pagina detalle. Metodos: `ngOnInit()` carga equipo por id; `loadEquipment(id)` usa store; `statusBadge(status)` y `typeBadge(type)` para clases; `remove()` elimina y navega.
- `pages/equipment-form/equipment-form.page.ts`: formulario crear/editar. Metodos: `ngOnInit()` detecta modo edicion y carga datos; `toDateInput(date)` formatea fechas para inputs; `onSubmit()` valida con Zod, llama store `create/update`, muestra alertas y navega a lista.
- `schemas/equipment.zod.ts`: esquema `EquipmentDTOSchema` y tipo `EquipmentDTOInput` para validacion de formulario.

## Features: Location
- `state/location.store.ts`: store con signals. Metodos: `fetchAll()`, `setQuery/setStatus/setType/setPage/setPageSize`, `findById(id)`, `create(input)`, `update(id, patch)`, `remove(id)`; computa `filtered`, `paged`, `total`.
- `guards/location-exists-guard.ts`: valida existencia de ubicacion antes de editar/ver.
- `resolvers/location-list-resolver.ts`: precarga lista de ubicaciones via store.
- `components/location-table/location-table.ts`: recibe `data` y `locationMap`; metodos `statusClass(status)` para badges.
- `pages/location-list/location-list.page.ts`: listado con filtros; metodos `ngOnInit()`, `reload()`, `onQuery/onStatus/onType`, `previous/next` para paginar; computed `totalPages`.
- `pages/location-detail/location-detail.page.ts`: carga ubicacion por id en `ngOnInit()`; `loadLocation(id)` usa store; `remove()` borra y redirige.
- `pages/location-form/location-form.page.ts`: similar a equipment-form. Metodos: `ngOnInit()` carga ubicacion si id existe; `onSubmit()` valida con esquema, llama store `create/update` y navega.
- `schemas/location.zod.ts`: esquema y tipo `LocationDTOInput` para validar.

## Features: Maintenance
- `state/maintenance.store.ts`: store con signals. Metodos: `fetchAll()`, `setQuery/setStatus/setType/setPage/setPageSize`, `findById(id)`, `create(input)`, `update(id, patch)`, `remove(id)`; computa `filtered`, `paged`, `total`.
- `guards/maintenance-exists-guard.ts`: valida existencia de mantenimiento antes de editar.
- `resolvers/maintenance-list-resolver.ts`: precarga lista de mantenimientos via store.
- `components/maintenance-table/maintenance-table.ts`: tabla de mantenimientos; metodos `statusClass(status)` para estilos y `formatDate(date)` para mostrar fechas.
- `pages/maintenance-list/maintenance-list.page.ts`: listado con filtros; metodos `ngOnInit()`, `reload()`, `onQuery/onStatus/onType`, `previous/next`; computed `totalPages`.
- `pages/maintenance-detail/maintenance-detail.page.ts`: `ngOnInit()` carga mantenimiento; `loadMaintenance(id)` usa store; `remove()` elimina y navega.
- `pages/maintenance-form/maintenance-form.page.ts`: formulario crear/editar. Metodos: `ngOnInit()` carga equipos/ubicaciones y detecta modo edicion; `toDateInput(date)` para inputs; `onSubmit()` valida con Zod, llama store `create/update`, notifica y navega.
- `schemas/maintenance.zod.ts`: esquema y tipo `MaintenanceDTOInput`.

## Features: Users
- `state/user.store.ts`: store de usuarios. Metodos: `fetchAll()`, `findById(id)`, setters `setQuery/setRole/setStatus`, `create(input)`, `update(id, input)`, `remove(id)`; computed `filtered`, signal `total`.
- `components/user-table/user-table.ts`: tabla; metodos `statusClass(status)` para estilos y `roleLabel(role)` para etiquetas.
- `pages/user-list/user-list.page.ts`: lista con filtros; metodos `ngOnInit()`, `reload()`, `onQuery/onRole/onStatus`.
- `pages/user-form/user-form.page.ts`: formulario crear/editar. Metodos: `ngOnInit()` detecta modo edicion y carga usuario; `onSubmit()` valida y llama `UserStore.create/update`, notifica y navega.

## Pipes compartidos
- `ui/shared/pipes/status-label-pipe.ts`: pipe `statusLabel` para traducir valores de estado a etiquetas legibles.
- `ui/shared/pipes/type-label-pipe.ts`: pipe `typeLabel` para traducir tipos de equipo a etiquetas.

## Otros
- `ui/features/home/module-hub.page.html` y demas archivos HTML/CSS en features son solo plantillas/estilos (sin metodos TS).
- `public/`, `styles.css`, `proxy.conf.json`, `tailwind.config.js`, `postcss.config.js`: configuracion de build/estilos, sin logica TS.

> Nota: los esquemas Zod y contratos DTO no tienen metodos; solo definen estructura de datos. Los archivos `.html` y `.css` son plantillas y estilos, no contienen metodos de logica.
