import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BriefsService {
  constructor(private prisma: PrismaService) {}

  async getBrief(initiativeId: string) {
    return this.prisma.brief.findFirst({
      where: { initiativeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBriefs(initiativeId: string) {
    return this.prisma.brief.findMany({
      where: { initiativeId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
