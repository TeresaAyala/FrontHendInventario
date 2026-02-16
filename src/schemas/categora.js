import { z } from 'zod';

export const categoriaZodSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre es obligatorio"),

  descripcion: z.string()
    .max(200, "Máximo 200 caracteres")
    .optional(),

  estado: z.boolean().optional()
});
