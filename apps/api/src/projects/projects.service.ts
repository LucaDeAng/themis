import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, CreateCriterionDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        workspaceId: data.workspaceId,
        createdBy: data.createdBy,
        name: data.name,
        description: data.description,
        businessContext: data.businessContext,
        strategicGoals: data.strategicGoals,
      },
    });
  }

  async findAll(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, data: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
      return { message: 'Project deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  // Criteria management
  async addCriterion(projectId: string, data: CreateCriterionDto) {
    return this.prisma.criterion.create({
      data: {
        projectId,
        name: data.name,
        description: data.description,
        category: data.category,
        type: data.type || 'SOFT',
        weight: data.weight || 0.1,
        minThreshold: data.minThreshold,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async getCriteria(projectId: string) {
    return this.prisma.criterion.findMany({
      where: { projectId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async updateCriterion(id: string, data: Partial<CreateCriterionDto>) {
    try {
      const criterion = await this.prisma.criterion.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          type: data.type,
          weight: data.weight,
          minThreshold: data.minThreshold,
          displayOrder: data.displayOrder,
        },
        include: {
          project: true,
        },
      });
      return criterion;
    } catch (error) {
      throw new NotFoundException(`Criterion with ID ${id} not found`);
    }
  }

  async removeCriterion(id: string) {
    try {
      await this.prisma.criterion.delete({
        where: { id },
      });
      return { message: 'Criterion deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Criterion with ID ${id} not found`);
    }
  }
}
