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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, CreateCriterionDto } from './dto/project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createProjectDto: CreateProjectDto) {
    console.log('📥 Received createProjectDto:', JSON.stringify(createProjectDto, null, 2));
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects in a workspace' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  findAll(@Query('workspaceId') workspaceId: string) {
    return this.projectsService.findAll(workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // Criteria endpoints
  @Post(':id/criteria')
  @ApiOperation({ summary: 'Add a criterion to a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 201, description: 'Criterion created successfully' })
  addCriterion(
    @Param('id') projectId: string,
    @Body() createCriterionDto: CreateCriterionDto,
  ) {
    return this.projectsService.addCriterion(projectId, createCriterionDto);
  }

  @Get(':id/criteria')
  @ApiOperation({ summary: 'Get all criteria for a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Criteria retrieved successfully' })
  getCriteria(@Param('id') projectId: string) {
    return this.projectsService.getCriteria(projectId);
  }

  @Put('criteria/:criterionId')
  @ApiOperation({ summary: 'Update a criterion' })
  @ApiParam({ name: 'criterionId', description: 'Criterion ID' })
  @ApiResponse({ status: 200, description: 'Criterion updated successfully' })
  @ApiResponse({ status: 404, description: 'Criterion not found' })
  updateCriterion(
    @Param('criterionId') criterionId: string,
    @Body() updateCriterionDto: CreateCriterionDto,
  ) {
    return this.projectsService.updateCriterion(criterionId, updateCriterionDto);
  }

  @Delete('criteria/:criterionId')
  @ApiOperation({ summary: 'Delete a criterion' })
  @ApiParam({ name: 'criterionId', description: 'Criterion ID' })
  @ApiResponse({ status: 200, description: 'Criterion deleted successfully' })
  @ApiResponse({ status: 404, description: 'Criterion not found' })
  removeCriterion(@Param('criterionId') criterionId: string) {
    return this.projectsService.removeCriterion(criterionId);
  }
}
