import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { Actor, Aircraft, Airfield, Individual, Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AircraftShort, PermissionWithAirfieldsModel, PilotShort } from './dto/permission';
import { compareItems, isAircraft, isArrayIncludes } from './utils';

@Injectable()
export class PermissionsRepository {
    private readonly logger = new Logger(PermissionsRepository.name);

    constructor(
        private prisma: PrismaService,
    ) { }

    async getAllPermissions(): Promise<Permission[]> {
        return this.prisma.permission.findMany();
    }

    async getPilotsWithEmptyPermissionNumber(pilots: Array<Individual>): Promise<Array<Individual>> {
        return await this.prisma.individual.findMany({
            where: {
                permissions: {
                    some: {
                        permissionNumber: null,
                        pilots: {
                            some: {
                                id: {
                                    in: pilots.map(it => it.id)
                                }
                            }
                        }
                    }
                }
            },
        });
    }

    async getPermissionKsaPivp(
        permissionNumber: number | null
        , pilot: PilotShort | Individual
        , date: Date
        , aircraftNumber: string | AircraftShort | Aircraft
    ): Promise<Array<PermissionWithAirfieldsModel>> {
        let result: Array<Permission>;
        let clarifiedAircraftNumber: string;

        if (typeof aircraftNumber === 'string') {
            clarifiedAircraftNumber = aircraftNumber;
        } else if (isAircraft(aircraftNumber)) {
            clarifiedAircraftNumber = aircraftNumber.aircraftNumber;
        } else {
            throw new BadRequestException(`Wrong type of aircraftNumber parameter! Value:${aircraftNumber}!`);
        }

        const where = {
            permissionNumber,
            aircrafts: {
                some: {
                    aircraftNumber: clarifiedAircraftNumber,
                },
            },
            startDate: {
                lte: date,
            },
            endDate: {
                gte: date,
            },
            pilots: {
                some: {
                    firstName: pilot.firstName,
                    patronimyc: pilot.patronimyc,
                    lastName: pilot.lastName,
                },
            },
        }, include = {
            airfields: true,
        };

        // Разрешение c номером ?
        if (!permissionNumber) {
            console.log('aircraft', clarifiedAircraftNumber);
            result = await this.prisma.permission.findMany({
                where,
                include,
            });
        } else {
            // permissionNumbeк с непустым значением уникально для таблицы Permission
            const permission = await this.prisma.permission.findFirst({
                where,
                include,
            });

            if (permission) {
                result = [permission];
            } else {
                result = [];
            }
        }

        return result;
    }


    async getPermissionById(
        id: number
    ): Promise<Permission> {
        const result = await this.prisma.permission.findUnique({
            where: {
                id,
            },
            include: {
                pilots: true,
                airfields: true,
                aircrafts: true,
            },
        });

        return result;
    }

    async deletePermission(
        id: number
    ): Promise<boolean | undefined> {
        // Воркэраунд. Prisma в текущих версиях кидает ошибку при попытке удалить строку с несуществующим уникальным id
        const isExists = await this.prisma.permission.count({
            where: {
                id,
            }
        }) > 0;
        console.log('PermissionsRepository, isExists', isExists);
        if (!isExists) {
            console.log('PermissionsRepository, do not perform delete');
            return undefined;
        } else {
            return await this.prisma.$transaction(async (tx) => {
                const result = await tx.permission.delete({
                    where: {
                        id,
                    },
                });
                return !!result;
            });
        }
    }

    async addPermission(
        permissionNumber: number,
        aircrafts: Aircraft | Array<Aircraft>,
        pilots: Individual | Array<Individual>,
        airfields: Airfield | Array<Airfield>,
        recipient: Actor,
        target: string,
        zoneDescription: string,
        createDate: Date,
        startDate: Date,
        endDate: Date
    ): Promise<Permission | undefined> {
        const clarifiedPilots: Array<Individual> = !Array.isArray(pilots) ? [pilots] : pilots;
        const clarifiedAirfields: Array<Airfield> = !Array.isArray(airfields) ? [airfields] : airfields;
        const clarifiedAircrafts: Array<Aircraft> = !Array.isArray(aircrafts) ? [aircrafts] : aircrafts;

        const createData = {
            aircrafts: {
                connect: clarifiedAircrafts.map(it => ({ id: it.id, }))
            },
            pilots: {
                connect: clarifiedPilots.map(it => ({ id: it.id, })),
            },
            airfields: {
                connect: clarifiedAirfields.map(it => ({ id: it.id, }))
            },
            recipient: {
                connect: {
                    id: recipient.id,
                },
            },
            target,
            zoneDescription,
            createDate: createDate,
            startDate: startDate,
            endDate: endDate,
        };

        let result: Permission | undefined;

        if (permissionNumber) {
            result = await this.prisma.permission.upsert({
                where: {
                    permissionNumber,
                },
                update: {},
                create: {
                    permissionNumber,
                    ...createData,
                }
            });
        } else {
            const existingPilots = await this.getPilotsWithEmptyPermissionNumber(clarifiedPilots);
            // Если кто-то из добавляемых пилотов уже привязан к одному из разрешений без номера, не добавляем
            if (existingPilots.length > 0) {
                this.logger.error('Невозможно создать разрешение без номера, если добавляемые в него внешние пилоты уже распределены по другим разрешениям без номеров!');
                result = undefined;
            } else {
                result = await this.prisma.permission.create({
                    data: {
                        ...createData,
                    }
                });
            }
        }

        return result;
    }
}
