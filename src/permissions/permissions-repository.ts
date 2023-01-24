import { Injectable } from '@nestjs/common';
import { Aircraft, Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AircraftShort, compareItems, isAircraft, isArrayIncludes, PilotShort } from './dto/permission';

@Injectable()
export class PermissionsRepository {
    constructor(
        private prisma: PrismaService,
    ) { }
    
    async getAllPermissions(): Promise<Permission[]> {
        return this.prisma.permission.findMany();
    }

    async getPermission(
        permissionNumber: number | null | undefined
        , pilots: PilotShort[]
        , date: Date
        , aircraftNumber: string | AircraftShort | Aircraft
    ): Promise<Permission | undefined> {
        let result: Permission | undefined;
    
        if (isAircraft(aircraftNumber)) {
            aircraftNumber = aircraftNumber.aircraftNumber;
        }
    
        if (!permissionNumber) {
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
    
            result = permissions.find(it => isArrayIncludes(pilots, it.pilots, compareItems));
        } else {
            result = await this.prisma.permission.findFirst({
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
        }
    
        return result;
    }
}
