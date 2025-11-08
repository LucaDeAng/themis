import { IsString, IsOptional, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInitiativeDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'Initiative title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Initiative description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Rationale' })
  @IsString()
  @IsOptional()
  rationale?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Risks', type: [String] })
  @IsArray()
  @IsOptional()
  risks?: string[];

  @ApiProperty({ description: 'User ID creating the initiative' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateInitiativeDto {
  @ApiPropertyOptional({ description: 'Initiative title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Initiative description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Rationale' })
  @IsString()
  @IsOptional()
  rationale?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Risks', type: [String] })
  @IsArray()
  @IsOptional()
  risks?: string[];
}
