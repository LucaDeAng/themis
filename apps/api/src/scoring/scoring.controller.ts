import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScoringService } from './scoring.service';

@ApiTags('scoring')
@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post()
  @ApiOperation({ summary: 'Add a score to an initiative' })
  addScore(@Body() data: any) {
    return this.scoringService.addScore(data);
  }

  @Get(':initiativeId')
  @ApiOperation({ summary: 'Get all scores for an initiative' })
  getScores(@Param('initiativeId') initiativeId: string) {
    return this.scoringService.getScores(initiativeId);
  }
}
