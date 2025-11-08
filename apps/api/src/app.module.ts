import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { InitiativesModule } from './initiatives/initiatives.module';
import { ScoringModule } from './scoring/scoring.module';
import { RankingModule } from './ranking/ranking.module';
import { GenerationModule } from './generation/generation.module';
import { BriefsModule } from './briefs/briefs.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    ProjectsModule,
    InitiativesModule,
    ScoringModule,
    RankingModule,
    GenerationModule,
    BriefsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
