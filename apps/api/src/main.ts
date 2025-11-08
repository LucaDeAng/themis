import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
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

  const port = process.env.PORT || process.env.API_PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`\n🚀 Themis API is running on: http://0.0.0.0:${port}`);
  console.log(`📚 API Documentation: http://0.0.0.0:${port}/api/docs`);
  console.log(`\n✨ Gen AI Engine Ready!\n`);
}

bootstrap();
