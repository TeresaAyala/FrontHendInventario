import { z } from 'zod';

export const usuarioZodSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),

  apellido: z
    .string({ required_error: 'El apellido es obligatorio' })
    .min(1, 'El apellido no puede estar vacío'),

  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El formato del email no es válido'),

  telefono: z
    .string()
    .optional(),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),

  roles: z
    .enum(['ADMIN', 'INVENTORY', 'SALES'], {
      errorMap: (issue, ctx) => ({
        message: `${ctx.data} no es un rol válido`,
      }),
    })
    .default('SALES'),

  status: z
    .enum(['active', 'inactive'], {
      errorMap: (issue, ctx) => ({
        message: `${ctx.data} no es un estado válido`,
      }),
    })
    .default('active'),
});

export const loginSchema = usuarioZodSchema.pick({
  email: true,
  password: true,
});
export const changePasswordSchema = z.object({
  newPassword: z
    .string({ required_error: 'La contraseña actual obligatoria' })
    .min(6, 'La contraseña actual debe tener al menos 6 caracteres'),
  currentPassword: z
    .string({ required_error: 'La nueva contraseña es obligatoria' })
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),

});