import { z } from 'zod';

export const detalleReciboZodSchema = z.object({
  recibo: z.string()
    .min(1, "El recibo es obligatorio"),

  producto: z.string()
    .min(1, "El producto es obligatorio"),

  cantidad: z.number({
    required_error: "La cantidad es obligatoria"
  }).min(1, "Debe ser mayor a 0"),

  precio: z.number({
    required_error: "El precio es obligatorio"
  }).min(0, "No puede ser negativo"),

  subtotal: z.number({
    required_error: "El subtotal es obligatorio"
  }).min(0, "No puede ser negativo")
});
