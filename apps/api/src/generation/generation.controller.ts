import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerationService } from './generation.service';
import { GenerateInitiativesDto, GenerateBriefDto, EnrichInitiativeDto } from './dto/generation.dto';

@ApiTags('generation')
@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('initiatives')
  @ApiOperation({ 
    summary: 'Generate initiatives using AI',
    description: 'Uses LLM to generate creative initiative ideas based on business context and strategic goals'
  })
  @ApiResponse({ status: 201, description: 'Initiatives generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or generation failed' })
  generateInitiatives(@Body() dto: GenerateInitiativesDto) {
    return this.generationService.generateInitiatives(dto);
  }

  @Post('brief')
  @ApiOperation({ 
    summary: 'Generate concept brief using AI',
    description: 'Creates a comprehensive concept brief with executive summary, rationale, risks, and metrics'
  })
  @ApiResponse({ status: 201, description: 'Brief generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or generation failed' })
  generateBrief(@Body() dto: GenerateBriefDto) {
    return this.generationService.generateBrief(dto);
  }

  @Post('enrich')
  @ApiOperation({ 
    summary: 'Enrich initiative with AI-generated tags and insights',
    description: 'Adds tags, identifies risks, and suggests related concepts using AI'
  })
  @ApiResponse({ status: 200, description: 'Initiative enriched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or enrichment failed' })
  enrichInitiative(@Body() dto: EnrichInitiativeDto) {
    return this.generationService.enrichInitiative(dto);
  }
}
