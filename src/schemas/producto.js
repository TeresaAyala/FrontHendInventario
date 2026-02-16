import { z } from 'zod';

export const productoZodSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  categoria: z.string()
    .min(2, "La categoría es obligatoria"),

  sku: z.string()
    .min(1, "El SKU es obligatorio"),

  precio: z.number({
    required_error: "El precio es obligatorio"
  }).min(0, "No puede ser negativo"),

  cantidad: z.number({
    required_error: "La cantidad es obligatoria"
  }).min(0, "No puede ser negativa"),

  imagen: z.string().optional(),

  estadoStock: z.enum(['DISPONIBLE', 'AGOTADO']).optional()
});
