import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto/initiative.dto';

@Injectable()
export class InitiativesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInitiativeDto) {
    return this.prisma.initiative.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        source: 'MANUAL',
      },
    });
  }

  async findAll(projectId: string) {
    return this.prisma.initiative.findMany({
      where: { projectId },
      include: {
        scores: {
          include: {
            criterion: true,
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        aggregateScores: true,
        brief: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const initiative = await this.prisma.initiative.findUnique({
      where: { id },
      include: {
        project: true,
        scores: {
          include: {
            criterion: true,
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        aggregateScores: true,
        gateResults: {
          include: {
            requirement: true,
          },
        },
        brief: true,
      },
    });

    if (!initiative) {
      throw new NotFoundException(`Initiative with ID ${id} not found`);
    }

    return initiative;
  }

  async update(id: string, data: UpdateInitiativeDto) {
    try {
      return await this.prisma.initiative.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          tags: data.tags,
        },
        include: {
          scores: true,
          aggregateScores: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Initiative with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.initiative.delete({
        where: { id },
      });
      return { message: 'Initiative deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Initiative with ID ${id} not found`);
    }
  }
}
