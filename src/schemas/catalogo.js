import { z } from 'zod';

export const catalogoZodSchema = z.object({
  codigo: z.string()
    .min(1, "El código es obligatorio"),

  nombre: z.string()
    .min(3, "El nombre es obligatorio"),

  descripcion: z.string()
    .max(200, "Máximo 200 caracteres")
    .optional(),

  imagen: z.string().optional(),

  estado: z.enum(['Activo', 'Inactivo']).optional()
});
