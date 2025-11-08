import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  async addScore(data: any) {
    return this.prisma.score.create({
      data: {
        initiativeId: data.initiativeId,
        criterionId: data.criterionId,
        reviewerId: data.reviewerId,
        value: data.score || data.value,
        confidence: data.confidence,
      },
    });
  }

  async getScores(initiativeId: string) {
    return this.prisma.score.findMany({
      where: { initiativeId },
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
    });
  }
}
