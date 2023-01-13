import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RadarModelsTransformer } from './radar-models-transformer';
import { RadarInfoHelper } from './radar-info-helper';
import { RadarInfoRepository } from './radar-info-repository';
import { RadarInfoService } from './radar-info.service';
import { RadarInfoController } from './radar-info.controller';

@Module({
    imports: [PrismaModule],
    controllers: [RadarInfoController],
    providers: [RadarInfoHelper, RadarModelsTransformer, RadarInfoService, RadarInfoRepository],
    exports: [RadarInfoHelper],
})
export class RadarInfoModule { };