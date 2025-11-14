import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateInitiativesDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'Workspace ID' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ description: 'Business context for AI generation' })
  @IsString()
  @IsNotEmpty()
  businessContext: string;

  @ApiPropertyOptional({ description: 'Strategic goals', type: [String] })
  @IsArray()
  @IsOptional()
  strategicGoals?: string[];

  @ApiPropertyOptional({ description: 'Number of initiatives to generate', default: 3 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  count?: number;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class GenerateBriefDto {
  @ApiProperty({ description: 'Initiative ID' })
  @IsString()
  @IsNotEmpty()
  initiativeId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class EnrichInitiativeDto {
  @ApiProperty({ description: 'Initiative ID' })
  @IsString()
  @IsNotEmpty()
  initiativeId: string;
}

export class FeasibilityCheckDto {
  @ApiProperty({ description: 'Initiative ID' })
  @IsString()
  @IsNotEmpty()
  initiativeId: string;

  @ApiProperty({ description: 'Initiative name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Initiative description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Criterion scores', type: [Object] })
  @IsArray()
  @IsOptional()
  scores?: Array<{
    criterion: string;
    score: number;
    weight: number;
    weighted: number;
  }>;
}

export class GenerateFullBriefDto {
  @ApiProperty({ description: 'Initiative ID' })
  @IsString()
  @IsNotEmpty()
  initiativeId: string;

  @ApiProperty({ description: 'Initiative name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Initiative description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Weighted score' })
  @IsNumber()
  weightedScore: number;

  @ApiPropertyOptional({ description: 'Criterion breakdown', type: [Object] })
  @IsArray()
  @IsOptional()
  criterionBreakdown?: any[];
}
