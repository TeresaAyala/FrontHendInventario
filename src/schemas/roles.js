import { z } from 'zod';

export const rolesZodSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "Máximo 50 caracteres"),

  descripcion: z.string()
    .max(150, "Máximo 150 caracteres")
    .optional(),

  estado: z.enum(['ACTIVO', 'INACTIVO'])
    .optional()
});
