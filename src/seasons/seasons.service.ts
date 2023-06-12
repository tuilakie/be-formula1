import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(paginationQuery: { skip?: string; take?: string }) {
    const { skip, take } = paginationQuery;
    if (skip && take) {
      if (isNaN(+skip) || isNaN(+take)) {
        throw new HttpException('Skip and take should be a number', 400);
      }
      return this.prisma.season.findMany({
        select: {
          id: true,
          name: true,
        },
        skip: +skip,
        take: +take,
      });
    }
    return this.prisma.season.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  findOne(name: string) {
    return this.prisma.season.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        races: {
          select: {
            id: true,
            title: true,
            grandPrix: true,
            date: true,
            circuit: true,
          },
        },
      },
    });
  }
}