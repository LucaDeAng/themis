import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    // Check database connectivity
    const dbHealthy = await this.prisma.healthCheck();
    
    return {
      status: dbHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'Themis API',
      version: '0.1.0',
      database: dbHealthy ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
