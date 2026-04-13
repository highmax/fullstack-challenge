import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Cache the server instance across Lambda invocations.
// AWS Lambda can reuse the same container for multiple requests (warm start).
// By caching, we avoid re-bootstrapping NestJS on every request, which saves ~2-3s.
let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  // If the server was already initialized in a previous invocation, reuse it
  if (cachedServer) return cachedServer;

  // Create a plain Express app — this is needed because AWS Lambda
  // doesn't run a traditional HTTP server. Instead, @vendia/serverless-express
  // translates Lambda events (API Gateway requests) into Express requests.
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  // Bootstrap NestJS using the Express adapter instead of the default listener.
  // This means NestJS handles routing and logic, but Express handles the HTTP layer.
  const app = await NestFactory.create(AppModule, adapter);

  // Apply the same global configuration as main.ts (local dev entry point)
  // so the Lambda version behaves identically to local development.
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Initialize NestJS without calling listen() — Lambda doesn't need a port,
  // it receives events directly from API Gateway.
  await app.init();

  // Wrap the Express app with serverless-express, which converts
  // API Gateway events <-> Express req/res objects automatically.
  cachedServer = serverlessExpress({ app: expressApp });
  return cachedServer;
}

// This is the function AWS Lambda calls on every request.
// API Gateway sends an event (with path, method, headers, body),
// and this handler passes it through to our cached NestJS/Express app.
export const handler: Handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
