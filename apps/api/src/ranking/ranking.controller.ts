import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'Get rankings for a project' })
  getRankings(@Query('projectId') projectId: string) {
    return this.rankingService.getRankings(projectId);
  }
}
