import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
