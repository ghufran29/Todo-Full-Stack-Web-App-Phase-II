import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:8000'),
  NEXT_PUBLIC_JWT_TOKEN_KEY: z.string().default('auth_token'),
  NEXT_PUBLIC_REFRESH_TOKEN_KEY: z.string().default('refresh_token'),
});

// Validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.flatten().fieldErrors);

  // Use fallback values for development
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL = 'http://localhost:3000';
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8000';
  process.env.NEXT_PUBLIC_JWT_TOKEN_KEY = 'auth_token';
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY = 'refresh_token';
}

export const authConfig = {
  // Base URLs
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  authUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',

  // Token storage keys
  tokenKey: process.env.NEXT_PUBLIC_JWT_TOKEN_KEY || 'auth_token',
  refreshTokenKey: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'refresh_token',

  // Token expiration (in seconds) - defaults to 1 hour for access token
  accessTokenExpiration: 3600,

  // Refresh token expiration (in seconds) - defaults to 7 days
  refreshTokenExpiration: 7 * 24 * 3600,

  // Default API timeout
  apiTimeout: 10000, // 10 seconds

  // Error messages
  defaultErrorMessage: 'An unexpected error occurred',
  unauthorizedMessage: 'Authentication required',
  forbiddenMessage: 'Access forbidden',

  // Validation rules
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passwordMinLength: 8,
  passwordRules: [
    'At least 8 characters long',
    'Contains uppercase letter',
    'Contains lowercase letter',
    'Contains number',
    'Contains special character'
  ]
};