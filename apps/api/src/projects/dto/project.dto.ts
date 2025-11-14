import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Workspace ID' })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Business context for AI generation' })
  @IsString()
  @IsOptional()
  businessContext?: string;

  @ApiPropertyOptional({ description: 'Strategic goals', type: [String] })
  @IsArray()
  @IsOptional()
  strategicGoals?: string[];

  @ApiProperty({ description: 'User ID creating the project' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: 'Project name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Business context' })
  @IsString()
  @IsOptional()
  businessContext?: string;

  @ApiPropertyOptional({ description: 'Strategic goals', type: [String] })
  @IsArray()
  @IsOptional()
  strategicGoals?: string[];
}

export class CreateCriterionDto {
  @ApiProperty({ description: 'Criterion name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Criterion description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Category (Strategic, Financial, Operational, Risk, Customer, Innovation)' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Type: HARD gate or SOFT scoring', default: 'SOFT' })
  @IsString()
  @IsOptional()
  type?: 'HARD' | 'SOFT';

  @ApiPropertyOptional({ description: 'Weight (0.0 to 1.0, default: 0.1)', default: 0.1 })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Minimum threshold (2-5) for SOFT criteria' })
  @IsOptional()
  minThreshold?: number;

  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Scale minimum', default: 1 })
  @IsOptional()
  scaleMin?: number;

  @ApiPropertyOptional({ description: 'Scale maximum', default: 5 })
  @IsOptional()
  scaleMax?: number;
}
