import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { KsaPivpPermissionDetailedResponse, NOT_FOUND_PERMISSION_RESPONSE, PilotShort } from './dto/permission';
import { PermissionsRepository } from './permissions-repository';
import moment from 'moment';

const DATE_FORMAT = 'DD.MM.YYYY kk:mm';

@Injectable()
export class PermissionsService {
    constructor(
        private repository: PermissionsRepository,
    ) { }

    async getAllPermissions(): Promise<KsaPivpPermissionDetailedResponse[]> {
        const result = await this.repository.getAllPermissions();
        return [];
    }

    async getPermissionsBy(
        number: number, pilots: PilotShort[], date: Date, aircraftNumber: string
    ): Promise<KsaPivpPermissionDetailedResponse> {
        const result = await this.repository.getPermissionBy(number, pilots, date, aircraftNumber);

        if (!result) {
            return NOT_FOUND_PERMISSION_RESPONSE;
        }

        return {
            result: !!result,
            details: {
                permissionNumber: result.permissionNumber,
                startDate: moment(result.startDate).format(DATE_FORMAT),
                endDate: moment(result.endDate).format(DATE_FORMAT),
                target: result.target,
                airfields: [],
                aircraftNumbers: [],
                pilots: [],
            }
        };
    }
}
