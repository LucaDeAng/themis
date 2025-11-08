import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto/initiative.dto';

@ApiTags('initiatives')
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new initiative' })
  @ApiResponse({ status: 201, description: 'Initiative created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createInitiativeDto: CreateInitiativeDto) {
    return this.initiativesService.create(createInitiativeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all initiatives in a project' })
  @ApiQuery({ name: 'projectId', required: true })
  @ApiResponse({ status: 200, description: 'Initiatives retrieved successfully' })
  findAll(@Query('projectId') projectId: string) {
    return this.initiativesService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an initiative by ID' })
  @ApiParam({ name: 'id', description: 'Initiative ID' })
  @ApiResponse({ status: 200, description: 'Initiative retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Initiative not found' })
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an initiative' })
  @ApiParam({ name: 'id', description: 'Initiative ID' })
  @ApiResponse({ status: 200, description: 'Initiative updated successfully' })
  @ApiResponse({ status: 404, description: 'Initiative not found' })
  update(@Param('id') id: string, @Body() updateInitiativeDto: UpdateInitiativeDto) {
    return this.initiativesService.update(id, updateInitiativeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an initiative' })
  @ApiParam({ name: 'id', description: 'Initiative ID' })
  @ApiResponse({ status: 200, description: 'Initiative deleted successfully' })
  @ApiResponse({ status: 404, description: 'Initiative not found' })
  remove(@Param('id') id: string) {
    return this.initiativesService.remove(id);
  }
}
