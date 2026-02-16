import { z } from 'zod';

export const reciboZodSchema = z.object({
  folio: z.string()
    .min(1, "El folio es obligatorio"),

  subtotal: z.number({
    required_error: "El subtotal es obligatorio"
  }).min(0, "No puede ser negativo"),

  impuestos: z.number({
    required_error: "Los impuestos son obligatorios"
  }).min(0, "No puede ser negativo"),

  total: z.number({
    required_error: "El total es obligatorio"
  }).min(0, "No puede ser negativo"),

  estado: z.enum(['Activo', 'Anulado']).optional()
});
