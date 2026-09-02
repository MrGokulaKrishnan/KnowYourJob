import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[a-z]/, 'Must include at least one lowercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const emailLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const onboardingProfileSchema = z.object({
  headline: z.string().min(3, 'Headline is required'),
  yearsOfExperience: z.number().min(0).max(50),
  skills: z.array(z.string()).min(1, 'Add at least one skill'),
  roles: z.array(z.string()).min(1, 'Select at least one preferred role'),
  locations: z.array(z.string()).min(1, 'Add at least one location or Remote'),
  remoteType: z.enum(['remote', 'hybrid', 'onsite', 'any']),
  minimumSalary: z.number().nullable(),
});
