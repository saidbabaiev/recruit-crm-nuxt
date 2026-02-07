import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const candidateFormZod = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),

  last_name: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .trim()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must not exceed 20 characters')
    .regex(/^[\d\s+()-]+$/, 'Phone can only contain digits and symbols +()-')
    .optional()
    .or(z.literal('')),

  country: z
    .string()
    .trim()
    .max(50, 'Country must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .trim()
    .max(50, 'City must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  relocation_willingness: z.boolean().optional(),

  remote_work_preference: z.enum(['remote', 'hybrid', 'onsite', 'null']).nullable().optional(),

  current_position: z
    .string()
    .trim()
    .max(50, 'Current position must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  current_company: z
    .string()
    .trim()
    .max(50, 'Current company must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  experience_years: z.preprocess(
    val => (val === '' || val === null || val === undefined ? null : Number(val)), z
      .number()
      .min(0, 'Experience years must be at least 0')
      .max(50, 'Experience years must not exceed 50')
      .nullable()
      .optional(),
  ),

  expected_salary_min: z
    .number()
    .min(0, 'Expected salary min must be at least 0')
    .max(1000000, 'Expected salary min must not exceed 1000000')
    .nullable()
    .optional(),

  expected_salary_max: z
    .number()
    .min(0, 'Expected salary max must be at least 0')
    .nullable()
    .optional(),

  salary_currency: z
    .string()
    .max(50, 'Salary currency must not exceed 50 characters')
    .regex(/^[A-Z]{3}$/, 'Salary currency must be a 3-letter currency code (e.g. USD, EUR, GBP, etc.)')
    .nullable()
    .optional(),

  salary_period: z.enum(['yearly', 'monthly', 'null']).nullable().optional(),

  notice_period: z.enum(['1 week', '2 weeks', '3 weeks', '1 month', '2 months', '3 months', '4 months', '5 months', '6 months', '7 months', '8 months', '9 months', '10 months', '11 months', '12 months', 'null']).nullable().optional(),

  availability_date: z.date().nullable().optional(),

  linkedin_url: z
    .string()
    .trim()
    .url('Please enter a valid LinkedIn URL')
    .nullable()
    .optional(),

  github_url: z
    .string()
    .trim()
    .url('Please enter a valid GitHub URL')
    .nullable()
    .optional(),

  skills: z.array(z.string()).nullable().optional(),

  languages: z.array(z.string()).nullable().optional(),

}).superRefine((data, ctx) => {
  const hasMin = data.expected_salary_min !== null && data.expected_salary_min !== undefined
  const hasMax = data.expected_salary_max !== null && data.expected_salary_max !== undefined

  if (hasMin || hasMax) {
    if (!data.salary_currency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Currency is required if salary is set',
        path: ['salary_currency'],
      })
    }

    if (!data.salary_period || data.salary_period === 'null') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Period is required if salary is set',
        path: ['salary_period'],
      })
    }

    if (hasMin && !hasMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected salary max is required',
        path: ['expected_salary_max'],
      })
    }

    if (hasMax && !hasMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected salary min is required',
        path: ['expected_salary_min'],
      })
    }

    if (hasMin && hasMax && data.expected_salary_max! < data.expected_salary_min!) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max salary must be greater than min salary',
        path: ['expected_salary_max'],
      })
    }
  }
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
  remote_work_preference: null,
  expected_salary_min: null,
  expected_salary_max: null,
  salary_currency: null,
  salary_period: null,
  notice_period: null,
  availability_date: null,
  linkedin_url: null,
  github_url: null,
  skills: null,
  languages: null,
}
