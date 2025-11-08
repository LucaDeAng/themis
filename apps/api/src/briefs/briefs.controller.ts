import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BriefsService } from './briefs.service';

@ApiTags('briefs')
@Controller('briefs')
export class BriefsController {
  constructor(private readonly briefsService: BriefsService) {}

  @Get('initiative/:initiativeId')
  @ApiOperation({ summary: 'Get latest brief for an initiative' })
  getBrief(@Param('initiativeId') initiativeId: string) {
    return this.briefsService.getBrief(initiativeId);
  }

  @Get('initiative/:initiativeId/all')
  @ApiOperation({ summary: 'Get all briefs for an initiative' })
  getAllBriefs(@Param('initiativeId') initiativeId: string) {
    return this.briefsService.getBriefs(initiativeId);
  }
}
