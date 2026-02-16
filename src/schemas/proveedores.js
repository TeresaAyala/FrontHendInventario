import { z } from 'zod';

export const proveedorZodSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre es obligatorio"),

  contacto: z.string().optional(),

  telefono: z.string()
    .min(8, "Teléfono inválido")
    .optional(),

  email: z.string()
    .email("Correo inválido")
    .optional(),

  direccion: z.string().optional(),

categoria: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Categoria',
  required: true
},

  estado: z.boolean().optional()
});
