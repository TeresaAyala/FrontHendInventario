import { z } from 'zod';

export const movimientosInventarioZodSchema = z.object({
  producto: z.string()
    .min(1, "El producto es obligatorio"),

  tipo: z.enum(['ENTRADA', 'SALIDA']),

  cantidad: z.number({
    required_error: "La cantidad es obligatoria"
  }).min(1, "Debe ser mayor a 0")
});
