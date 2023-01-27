import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Permission } from '@prisma/client';
import {
    KsaPivpPermissionDetailedResponse,
    NOT_FOUND_PERMISSION_RESPONSE,
    KsaPivpPermissionRequestDto,
    PilotShort,
    KsaPivpPermissionDetails,
    PermissionWithAirfieldsModel
} from './dto/permission';
import { PermissionsRepository } from './permissions-repository';
import * as moment from 'moment';
import { DATE_FORMAT } from 'src/utils';



@Injectable()
export class PermissionsService {
    private readonly logger = new Logger(PermissionsService.name);

    private transformPermission(permission: PermissionWithAirfieldsModel): KsaPivpPermissionDetails {
        if (permission.zoneDescription) {
            // БПЛА
            return {
                target: permission.target,
                zoneDescription: permission.zoneDescription,
            };

        } else if (permission.airfields) {
            // ПЛА
            return {
                target: permission.target,
                airfields: permission.airfields.map(it => ({
                    name: it.name,
                    code: it.code,
                })),
            };
        } else {
            // Какая-то фигня, считаем, что ничего не нашли
            this.logger.error('Сервис не может преобразовать модель в возвращаемый тип!');
            throw new BadRequestException(`Ошибка при получении разрешения для КсаПиВП!`);;
        }
    }

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

    async checkPermissionByKsaPivpRequest(
        ksaPivpRequest: KsaPivpPermissionRequestDto
    ): Promise<KsaPivpPermissionDetailedResponse> {
        // 0 - значение, когда заявка не имеет номера
        const result = await this.repository.getPermissionKsaPivp(
            ksaPivpRequest.permissionNumber,
            ksaPivpRequest.pilot,
            moment(ksaPivpRequest.date, DATE_FORMAT).toDate(),
            ksaPivpRequest.aircraftNumber
        )
        if (!result.length) {
            return {
                result: false,
            };
        } else if (result.length > 0) {
            if (result.length === 1) {
                return {
                    result: true,
                    details: this.transformPermission(result[0])
                };
            } else {
                return {
                    result: true,
                    details: result.map(it => this.transformPermission(it)),
                }
            }
        }

        // Какая-то фигня, считаем, что ничего не нашли
        this.logger.error('Сервис не может разпознать возвращаемый тип!');
        throw new BadRequestException(`Ошибка при получении разрешения для КсаПиВП!`);
    };

    async deletePermissionById(id: number): Promise<boolean | undefined> {
        this.logger.log(`PermissionsService, deletePermissionById: ${id}`);
        const result = await this.repository.deletePermission(id);
        this.logger.log(`PermissionsService, deletePermissionById, result: ${result}`);
        return result;
    }
}
