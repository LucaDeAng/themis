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
        ownerId: data.createdBy,
        title: data.name,
        description: data.description,
        status: 'DRAFT',
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
          title: data.name,
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
        weight: data.weight || 1.0,
        type: 'SOFT',
      },
    });
  }

  async getCriteria(projectId: string) {
    return this.prisma.criterion.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateCriterion(id: string, data: Partial<CreateCriterionDto>) {
    try {
      return await this.prisma.criterion.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          weight: data.weight,
        },
      });
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
