import { Injectable, OnModuleInit } from '@nestjs/common';
import IAdsbData from './dto/adsb-client-data';
import { RadarInfoRepository } from './radar-info-repository';
import { RadarModelsTransformer } from './radar-models-transformer';

@Injectable()
export class RadarInfoService implements OnModuleInit {
  async onModuleInit() {
    console.log('Init RadarInfoService');
  }

  constructor(
    private radarRepo: RadarInfoRepository,
    private transformer: RadarModelsTransformer,
  ) { }

  // получение всех бвс по источникам ADSB
  async getAllAdsb(): Promise<IAdsbData[]> {
    const dbResult = await this.radarRepo.getAllAdsb();
    const result = dbResult.map(it => this.transformer.transformAdsb(it));
    return result;
  }

  async getAdsbByTargetIdent(targetIdent: string): Promise<IAdsbData | undefined> {
    const dbResult = await this.radarRepo.getAdsbByTargetIdent(targetIdent);
    if (dbResult) {
      const result = this.transformer.transformAdsb(dbResult);
      return result;
    }

    return undefined;
  }

  async getAdsbByTargetAddress(targetAddress: number): Promise<IAdsbData | undefined> {
    const dbResult = await this.radarRepo.getAdsbByTargetAddress(targetAddress);
    if (dbResult) {
      const result = this.transformer.transformAdsb(dbResult);
      return result;
    }

    return undefined;
  }

}
