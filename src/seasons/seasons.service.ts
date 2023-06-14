import { race } from 'rxjs';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResponse } from '@/base/base.response.api';
import { SeasonRaces } from './entities/season.races.entity';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(paginationQuery: {
    skip?: string;
    take?: string;
  }): Promise<BaseResponse<{ name: string }[]>> {
    const { skip, take } = paginationQuery;
    const total = await this.prisma.season.count();
    let data: {
      name: string;
    }[] = null;
    if (skip && take) {
      if (isNaN(+skip) || isNaN(+take)) {
        throw new HttpException('Skip and take should be a number', 400);
      }
      data = await this.prisma.season.findMany({
        select: {
          name: true,
        },
        skip: +skip,
        take: +take,
      });
    } else {
      data = await this.prisma.season.findMany({
        select: {
          name: true,
        },
      });
    }

    return {
      success: true,
      message: 'Seasons retrieved successfully',
      data,
      meta: {
        total,
        pages: Math.ceil(total / +take),
        current: total === 0 ? 0 : Math.ceil(+skip / +take) + 1,
        size: data.length,
      },
    };
  }

  async findOne(name: string): Promise<BaseResponse<SeasonRaces>> {
    const data = await this.prisma.season.findUnique({
      where: {
        name,
      },
      select: {
        name: true,
        races: {
          select: {
            title: true,
            grandPrix: true,
            date: true,
            circuit: true,
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
    });
    return {
      success: true,
      message: 'Season retrieved successfully',
      data,
    };
  }
}
