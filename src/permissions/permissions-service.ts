import { Injectable } from '@nestjs/common';
import { Permissions } from '@prisma/client';
import { PermissionsRepository } from './permissions-repository';

export enum AircraftType {
    BVS = 0,
    PILOT
}

export type AircraftTypeKeys = keyof typeof AircraftType;

@Injectable()
export class PermissionsService {
    constructor(
        private repository: PermissionsRepository,
    ) { }

    async getAllPermissions(): Promise<Permissions[]> {
        return this.repository.getAllPermissions();
    }

    async getPermissionsBy(number: number, startDate: Date, endDate: Date, aircraftType: AircraftTypeKeys): Promise<Permissions | undefined> {
        const aircraftTypeNumber: number = AircraftType[aircraftType];
        // const startDateStr: string = moment(startDate, 'dd.MM.YYYY');
        // const endDate: string = "";
        return this.repository.getPermissionsBy('', '', '', aircraftTypeNumber);
      }
}
