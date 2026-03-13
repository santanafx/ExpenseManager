import z from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(3, 'Name must have at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must have at least 6 characters').optional(),
  role: z.enum(['ADMIN', 'BASIC_USER']).optional(),
}).refine(data => Object.values(data).some(v => v !== undefined), {
  message: 'At least one field must be provided for update',
})
