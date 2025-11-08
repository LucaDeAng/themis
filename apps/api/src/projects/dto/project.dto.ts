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

  @ApiPropertyOptional({ description: 'Weight (default: 1.0)', default: 1.0 })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Scale minimum', default: 1 })
  @IsOptional()
  scaleMin?: number;

  @ApiPropertyOptional({ description: 'Scale maximum', default: 5 })
  @IsOptional()
  scaleMax?: number;
}
