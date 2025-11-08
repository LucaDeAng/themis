import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async getRankings(projectId: string) {
    return this.prisma.rankList.findMany({
      where: { projectId },
      include: {
        rankedItems: {
          include: {
            initiative: true,
          },
          orderBy: { rank: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
