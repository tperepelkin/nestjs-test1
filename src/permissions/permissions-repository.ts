import { find } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PilotShort } from './dto/permission';

@Injectable()
export class PermissionsRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getAllPermissions(): Promise<Permission[]> {
        return this.prisma.permission.findMany();
    }

    async getPermissionBy(
        permissionNumber: number
        , pilots: PilotShort[]
        , date: Date
        , aircraftNumber: string
    ): Promise<Permission | undefined> {
        // Найдём список разрешений для списка условий, кроме ФИО.
        // Сделать поиск в SQL с перебором по динамическому массиву объектов проблематично
        const permissions = await this.prisma.permission.findMany({
            where: {
                permissionNumber,
                aircrafts: {
                    some: {
                        aircraftNumber,
                    },
                },
                startDate: {
                    lte: date,
                },
                endDate: {
                    gte: date,
                }
            },
            include: {
                aircrafts: true,
                pilots: true,
            },
        });

        
        // Среди списка разрешений найдём нужное с заданными ФИО
        const result = permissions.find(it => {
            it.pilots.length === pilots.length 
                && it.pilots.every(itemPilot => {
                    return pilots.some(pilot => 
                        pilot.firstName === itemPilot.firstName 
                        && pilot.patronimyc === itemPilot.patronimyc 
                        && pilot.lastName === itemPilot.lastName);
            });
        });
        return result;
    }
}
