import { Injectable } from '@nestjs/common';
import { Adsb } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RadarInfoRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getAllAdsb(): Promise<Adsb[]> {
        return this.prisma.adsb.findMany();
    }

    async getAdsbByTargetIdent(targetIdent: string): Promise<Adsb | undefined> {
        return this.prisma.adsb.findFirst({
            where: {
                targetIdent,
            }
        });
      }

      async getAdsbByTargetAddress(targetAddress: number): Promise<Adsb | undefined> {
        return this.prisma.adsb.findFirst({
            where: {
                targetAddress,
            }
        });
      }
}
