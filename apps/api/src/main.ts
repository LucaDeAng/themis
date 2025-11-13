import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin matches any allowed pattern
      const isAllowed = corsOrigins.some(pattern => {
        if (pattern.includes('*')) {
          // Convert wildcard pattern to regex
          const regexPattern = pattern.replace(/\*/g, '.*');
          const regex = new RegExp(`^${regexPattern}$`);
          return regex.test(origin);
        }
        return pattern === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Themis API')
    .setDescription(
      'GenAI-assisted initiative prioritization engine API. Generate, score, and rank strategic initiatives using AI.',
    )
    .setVersion('0.1.0')
    .addTag('projects', 'Project management')
    .addTag('initiatives', 'Initiative CRUD and AI generation')
    .addTag('scoring', 'Scoring and evaluation')
    .addTag('ranking', 'Ranking and prioritization')
    .addTag('generation', 'AI-powered content generation')
    .addTag('briefs', 'Concept brief management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  cachedApp = app;
  return app;
}

// For Vercel serverless
export default async (req, res) => {
  const app = await createApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};

// For local development
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || process.env.API_PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`\n🚀 Themis API is running on: http://0.0.0.0:${port}`);
  console.log(`📚 API Documentation: http://0.0.0.0:${port}/api/docs`);
  console.log(`\n✨ Gen AI Engine Ready!\n`);
}

if (require.main === module) {
  bootstrap();
}
