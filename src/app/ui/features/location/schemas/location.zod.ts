import z from "zod";

export const LocationDTOSchema = z.object({
    id: z.string().min(1),
    code: z.string().trim().min(1, 'Codigo es requerido'),
    name: z.string().trim().min(1, 'Nombre es requerido'),
    type: z.enum([
        'Office',
        'Warehouse',
        'DataCenter',
        'Lab',
        'Remote',
        'Other',
    ]),
    status: z.enum(['Active', 'Inactive', 'UnderMaintenance', 'Deprecated']),
    building: z.string().trim().optional(),
    floor: z.string().trim().optional(),
    room: z.string().trim().optional(),
    address: z.string().trim().optional(),
    metadata: z.union([
        z.record(z.unknown()),
        z.any().refine(v => v instanceof Map, {
            message: 'Debe ser Map o Record'
        })
    ]).default({}),
});

export type LocationDTOInput = z.infer<typeof LocationDTOSchema>;
