import { Injectable } from '@nestjs/common';
import { Adsb, Mlat } from '@prisma/client';
import IAdsbData from './dto/adsb-client-data';
import IMlatData from './dto/mlat-client-data';
import { RadarInfoHelper } from './radar-info-helper';

@Injectable()
export class RadarModelsTransformer {
    constructor(
        private helper: RadarInfoHelper,
    ) { }

    public transformAdsb(db: Adsb): IAdsbData {
        return {
            sacSic: db.dsi,
            latitude: db.latitude,
            longitude: db.longitude,
            altitude: this.helper.getAltitude(db.heightGround, db.heightFoots),
            courseAngle: db.courseAngle,
            targetNumber: db.targetNumber,
            targetIdent: db.targetIdent,
            targetAddress: db.targetAddress,
            squawk: db.squawk,
            planeType: db.emitCategory,
        }
    }

    public transformMlat(db: Mlat): IMlatData {
        return {
            sacSic: db.dsi,
            latitude: db.latitude,
            longitude: db.longitude,
            altitude: this.helper.getAltitude(db.heightGround, db.heightFoots),
            courseAngle: this.helper.getCourseAngle(db.velocityX, db.velocityY),
            targetNumber: db.targetNumber,
            targetIdent: db.targetIdent,
            targetAddress: db.targetAddress,
            squawk: db.squawk,
        }
    }

}
