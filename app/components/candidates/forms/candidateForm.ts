import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const candidateFormZod = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters')
    .transform(val => val.trim()),

  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^[\d\s+()-]+$/, 'Phone can only contain digits and symbols +()-')
    .optional()
    .or(z.literal('')),

  country: z
    .string()
    .max(50, 'Country must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .max(50, 'City must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  relocation_willingness: z.boolean().optional(),
  remote_work_preference: z.enum(['remote', 'hybrid', 'onsite']).nullable().optional(),

  current_position: z
    .string()
    .max(50, 'Current position must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  current_company: z
    .string()
    .max(50, 'Current company must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  experience_years: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)),
    z
      .number()
      .min(0, 'Experience years must be at least 0')
      .max(50, 'Experience years must not exceed 50')
      .nullable()
      .optional(),
  ),
})

export type CandidateFormValues = z.infer<typeof candidateFormZod>

export const candidateFormSchema = toTypedSchema(candidateFormZod)

export const candidateFormInitialValues: CandidateFormValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  current_position: '',
  current_company: '',
  experience_years: null,
  relocation_willingness: false,
  // remote_work_preference: null,
}
