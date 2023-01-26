import { Injectable, Logger } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { KsaPivpPermissionDetailedResponse, NOT_FOUND_PERMISSION_RESPONSE, PilotShort } from './dto/permission';
import { PermissionsRepository } from './permissions-repository';
import moment from 'moment';

const DATE_FORMAT = 'DD.MM.YYYY kk:mm';

@Injectable()
export class PermissionsService {
    private readonly logger = new Logger(PermissionsService.name);

    constructor(
        private repository: PermissionsRepository,
    ) { }

    async getAllPermissions(): Promise<Array<Permission>> {
        const result = await this.repository.getAllPermissions();
        return result;
    }

    async getPermissionById(id: number): Promise<Permission> {
        const result = await this.repository.getPermissionById(id);
        return result;
    }

    async deletePermissionById(id: number): Promise<boolean> {
        this.logger.log(`deletePermissionById: ${id}`);
        const result = await this.repository.deletePermission(id);
        return result;
    }
}
