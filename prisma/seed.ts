import {
    ActorType
    , Individual
    , PrismaClient
    , User
    , Role
    , Aircraft
    , Airfield
    , Actor
    , AircraftType
    , Permission
} from '@prisma/client';
import { v4 as uuid4 } from 'uuid';
import * as moment from 'moment';
import { AircraftShort, PilotShort } from '../src/permissions/dto/permission';
import { compareItems, isAircraft, isArrayIncludes } from '../src/permissions/utils';

const prisma = new PrismaClient();

const ENGENEER_GROUP_NAME = 'engeneer';
const DISPATCHER_GROUP_NAME = 'dispatcher';
const PILOT_GROUP_NAME = 'pilot';
const OWNER_GROUP_NAME = 'owner';

const BASE_ENGENEER_LOGIN_NAME = 'engeneer1';
const TEST_FIRST_DISPATCHER_LOGIN_NAME = 'dispatcher1';
const TEST_FIRST_PILOT_LOGIN_NAME = 'pilot1';
const TEST_SECOND_PILOT_LOGIN_NAME = 'pilot2';
const TEST_OWNER_LOGIN_NAME = 'owner1';

const AIRCRAFT1 = '1Г15001';
const AIRCRAFT2 = '98730170';
const AIRCRAFT3 = '37309001';
const AIRCRAFT4 = 'ТР301.22.005';
const AIRCRAFT5 = 'WA1073';

const PERMISSION1 = 1;
const PERMISSION2 = 2;
const PERMISSION3 = 3;
const PERMISSION4 = 4;
const PERMISSION5 = 5;
const PERMISSION6 = 6;

const DATE_FORMAT = 'YYYY.MM.DDThh:mm';
const DATE_TIME_FORMAT = 'YYYY.MM.DDThh:mm';

async function addIndividual(
    fio: { firstName: string; lastName: string; patronimyc: string; }
): Promise<Individual> {
    let person = await prisma.individual.findFirst({
        where: {
            firstName: fio.firstName,
            lastName: fio.lastName,
            patronimyc: fio.patronimyc,
        },
    });

    if (!person) {
        const passportSeries = Math.random().toString().substring(2, 6);
        const passportNumber = Math.random().toString().substring(2, 8);

        person = await prisma.individual.create({
            data: {
                firstName: fio.firstName,
                lastName: fio.lastName,
                patronimyc: fio.patronimyc,
                passportSeries,
                passportNumber,
                address: '',
                passportSource: '',
            },
        });
    }

    return person;
}

async function addAircraft(
    aircraftNumber: string,
    modelName: string = uuid4().toString().substring(0, 8),
    aircraftType: AircraftType = AircraftType.BVS,
) {
    return await prisma.aircraft.upsert({
        where: {
            aircraftNumber,
        },
        update: {},
        create: {
            aircraftNumber,
            modelName,
            aircraftType,
        },
    })
}

async function addAirfield(airfield: Airfield) {
    return await prisma.airfield.upsert({
        where: {
            code_name: {
                code: airfield.code,
                name: airfield.name,
            }
        },
        update: {},
        create: {
            code: airfield.code,
            name: airfield.name,
            type: airfield.type,
            latitude: airfield.latitude,
            longitude: airfield.longitude,
            militaryZoneId: airfield.militaryZoneId,
            militaryZoneName: airfield.militaryZoneName,
            workAboutSchedule: airfield.workAboutSchedule,
        }
    });
}

async function addActor(person: Individual, user?: User) {
    let data = {
        type: ActorType.USER,
        individual: {
            connect: {
                id: person.id,
            },
        },
    };

    if (user) {
        Object.assign(data, {
            user: {
                connect: {
                    id: user.id,
                },
            },
        });
    }

    return await prisma.actor.upsert({
        where: {
            individualId: person.id,
        },
        update: {},
        create: {
            type: ActorType.USER,
            ...data,
        },
    });
}

async function addRole(roleName, comment) {
    return await prisma.role.upsert({
        where: {
            name: roleName,
        },
        update: {},
        create: {
            name: roleName,
            comment: comment,
        }
    });
}

async function addUser(login: string, password: string, roles: Array<Role>) {
    return await prisma.user.upsert({
        where: {
            login: login,
        },
        update: {},
        create: {
            login: login,
            password: password,
            roles: {
                connect: roles.map(it => ({ id: it.id })),
            }
        }
    });
}

async function getPilotsWithEmptyPermissionNumber(pilots: Array<Individual>): Promise<Array<Individual>> {
    return await prisma.individual.findMany({
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

async function getPermissionKsaPivp(
    permissionNumber: number | null
    , pilot: PilotShort | Individual
    , date: Date
    , aircraftNumber: string | AircraftShort | Aircraft
): Promise<Array<Permission & {
    pilots?: Array<Individual>
}>> {
    let result: Array<Permission>;
    let clarifiedAircraftNumber: string;

    if (typeof aircraftNumber === 'string') {
        clarifiedAircraftNumber = aircraftNumber;
    } else if (isAircraft(aircraftNumber)) {
        clarifiedAircraftNumber = aircraftNumber.aircraftNumber;
    } else {
        throw new TypeError('Wrong type of aurcrafyNumber parameter!');
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
        pilots: true,
        aircrafts: true,
    };

    // Разрешение c номером ?
    if (!permissionNumber) {
        console.log('aircraft', clarifiedAircraftNumber);
        result = await prisma.permission.findMany({
            where,
            include,
        });
    } else {
        // permissionNumbeк с непустым значением уникально для таблицы Permission
        const permission = await prisma.permission.findFirst({
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

async function getPermission(
    id: number
): Promise<Permission> {
    const result = await prisma.permission.findUnique({
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

async function addPermission(
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
        result = await prisma.permission.upsert({
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
        const existingPilots = await getPilotsWithEmptyPermissionNumber(clarifiedPilots);
        // Если кто-то из добавляемых пилотов уже привязан к одному из разрешений без номера, не добавляем
        if (existingPilots.length > 0) {
            console.error('Невозможно создать разрешение без номера, если добавляемые в него внешние пилоты уже распределены по другим разрешениям без номеров!');
            result = undefined;
        } else {
            result = await prisma.permission.create({
                data: {
                    ...createData,
                }
            });
        }
    }

    return result;
}

async function main() {
    const engeneerGroup = await addRole(ENGENEER_GROUP_NAME, 'роль администратора');
    const dispatcherGroup = await addRole(DISPATCHER_GROUP_NAME, 'роль диспетчера');
    const pilotGroup = await addRole(PILOT_GROUP_NAME, 'роль внешнего пилота');
    const ownerGroup = await addRole(OWNER_GROUP_NAME, 'роль владельца воздушного судна');

    const engeneer1 = await addUser(BASE_ENGENEER_LOGIN_NAME, 'password', [engeneerGroup]);
    const dispatcher1 = await addUser(TEST_FIRST_DISPATCHER_LOGIN_NAME, 'password', [dispatcherGroup]);
    const pilot1 = await addUser(TEST_FIRST_PILOT_LOGIN_NAME, 'password', [pilotGroup]);
    const pilot2 = await addUser(TEST_SECOND_PILOT_LOGIN_NAME, 'password', [pilotGroup, ownerGroup]);
    const owner1: User = await addUser(TEST_OWNER_LOGIN_NAME, 'password', [ownerGroup]);

    // Добавляем тестовые аэродромы
    const airfield1 = await addAirfield({
        code: 'ЬЛЛ',
        name: 'Сольцы',
        type: 'ГОС',
        latitude: 58.139167,
        longitude: 30.328889,
        militaryZoneId: 7490,
        militaryZoneName: 'ULLL',
        workAboutSchedule: 'НОТАМ М2775/22 АД ОСУЩЕСТВЛЯЕТ ПРИЕМ И ВЫПУСК ВС ТОЛЬКО ПО ПРЕДВАРИТЕЛЬНОМУ СОГЛАСОВАНИЮ С КОМАНДИРОМ ВЧ33310-А (УС  МУСТАНГ )',
    } as Airfield);
    const airfield2 = await addAirfield({
        code: 'ЬЛОО',
        name: 'Псков (Кресты)',
        type: 'СОВМ.БАЗ.',
        latitude: 57.781944,
        longitude: 28.394167,
        militaryZoneId: 7490,
        militaryZoneName: 'ULLL',
        workAboutSchedule: null,
    } as Airfield);
    await addAirfield({
        code: 'ЬЛОС',
        name: 'Остров (Веретье)',
        type: 'ГОС',
        latitude: 57.295278,
        longitude: 28.433333,
        militaryZoneId: 7490,
        militaryZoneName: 'ULLL',
        workAboutSchedule: null,
    } as Airfield);
    const airfield3 = await addAirfield({
        code: 'УЛАА',
        name: 'Архангельск (Талаги)',
        type: 'ГРАЖДАН',
        latitude: 64.600278,
        longitude: 40.716667,
        militaryZoneId: 7490,
        militaryZoneName: 'ULLL',
        workAboutSchedule: '29/08/2022-29/10/2022 А4945/22 ВНЕ РЕГЛАМЕНТА РАБОТЫ АД ОБЕСПЕ4ИВАЕТСЯ ПРИЕМ/ВЫПУСК ВС РЕЙСОВ SU1334/1335, FV6303/6304. 5N115/116/117/150/152/164/175/176/1145/1146/1164, U6291/292  БЕЗ ДОПОЛНИТЕЛЬНОГО СОГЛАСОВАНИЯ.',
    } as Airfield);
    const airfield4 = await addAirfield({
        code: 'УЛАБ',
        name: 'Березник',
        type: 'ПЛОЩАДКА',
        latitude: 62.825,
        longitude: 42.791667,
        militaryZoneId: null,
        militaryZoneName: null,
        workAboutSchedule: null,
    } as Airfield);

    const ownerPerson1 = await addIndividual({ firstName: 'Повелитель', lastName: 'Беспилотников', patronimyc: 'Батькович', });
    const engenierPerson1 = await addIndividual({ firstName: 'Инженер', lastName: 'Администраторов', patronimyc: 'Батькович', });
    const dispatcherPerson1 = await addIndividual({ firstName: 'Диспетчер', lastName: 'Бэвээсов', patronimyc: 'Батькович', });
    const pilotPerson1 = await addIndividual({ firstName: 'Первый Пилот', lastName: 'Летунов', patronimyc: 'Батькович', });
    const pilotPerson2 = await addIndividual({ firstName: 'Второй Пилот', lastName: 'Летунович', patronimyc: 'Батькович', });

    const person1 = await addIndividual({ firstName: "Василий", patronimyc: "Иванович", lastName: "Чапаев", });
    const person2 = await addIndividual({ firstName: "Джон", patronimyc: "Эддардович", lastName: "Сноу", });
    const person3 = await addIndividual({ firstName: "Василий", patronimyc: "Алибабаевич", lastName: "Алибаба", });
    const person4 = await addIndividual({ firstName: "Алибаба", patronimyc: "Васильевич", lastName: "Бабеев", });

    // Добавляем акторов в систему для последующего связывания с разрешениями делаем их
    // пользователями в системе, связываем с соответствующими физическими лицами
    const owner1Actor = await addActor(ownerPerson1, owner1);
    const person1Actor = await addActor(pilotPerson1, pilot1);
    const pilot4Actor = await addActor(person4);

    const aircraft1 = await addAircraft(AIRCRAFT1);
    const aircraft2 = await addAircraft(AIRCRAFT4);
    const aircraft3 = await addAircraft(AIRCRAFT2);
    const aircraft4 = await addAircraft(AIRCRAFT5);
    const aircraft5 = await addAircraft(AIRCRAFT3);

    const permission1 = await addPermission(
        PERMISSION1,
        [aircraft1, aircraft2],
        [pilotPerson1, pilotPerson2, person3],
        [airfield1, airfield2, airfield3],
        owner1Actor,
        'Для использования воздушного пространства в зоне ограничения полётов',
        'Согласно "Порядку выполнения полётов беспилотными летательтными аппаратами ГУ МЧС РФ" по СПб',
        moment('10.01.2023', DATE_FORMAT).toDate(),
        moment('20.01.2023 10:30', DATE_FORMAT).toDate(),
        moment('30.01.2023 16:10', DATE_FORMAT).toDate(),
    );

    const permission2 = await addPermission(
        PERMISSION2,
        [aircraft1, aircraft2],
        [person2, person3],
        [airfield3],
        person1Actor,
        '123 АБВГД',
        '',
        moment('15.01.2023', DATE_FORMAT).toDate(),
        moment('20.02.2023 10:20', DATE_FORMAT).toDate(),
        moment('20.03.2023 21:20', DATE_FORMAT).toDate(),
    );

    const permission3 = await addPermission(
        PERMISSION3,
        [aircraft1, aircraft5],
        [person2, person3],
        [airfield3],
        person1Actor,
        '321 АБВГД',
        '',
        moment('15.10.2022', DATE_FORMAT).toDate(),
        moment('20.12.2022 01:20', DATE_FORMAT).toDate(),
        moment('20.09.2022 10:20', DATE_FORMAT).toDate(),
    );

    const permission4 = await addPermission(
        PERMISSION4,
        [aircraft4, aircraft2],
        [person2, person3],
        [airfield3],
        person1Actor,
        'Воздушное пространство',
        'Согласно "Порядку выполнения полётов беспилотными летательтными аппаратами ГУ МЧС РФ" по СПб',
        moment('10.01.2023', DATE_FORMAT).toDate(),
        moment('30.01.2023 19:20', DATE_FORMAT).toDate(),
        moment('10.02.2023 10:20', DATE_FORMAT).toDate(),
    );

    const permission5 = await addPermission(
        PERMISSION5,
        [aircraft4],
        [person1],
        [airfield4],
        pilot4Actor,
        '1111 22222',
        '11111 2222222 3333333333',
        moment('18.12.2022 10:20', DATE_FORMAT).toDate(),
        moment('20.03.2023 10:20', DATE_FORMAT).toDate(),
        moment('10.10.2022 10:20', DATE_FORMAT).toDate(),
    );

    const permission6 = await addPermission(
        null,
        aircraft4,
        [person2, person3],
        airfield4,
        pilot4Actor,
        '1111 22222',
        '11111 2222222 3333333333',
        moment('18.12.2022 10:20', DATE_FORMAT).toDate(),
        moment('20.03.2023 10:20', DATE_FORMAT).toDate(),
        moment('10.10.2022 10:20', DATE_FORMAT).toDate(),
    );
    console.log('New permission', permission6);

    const permissionNumber = null;
    const aircraftNumber = aircraft2.aircraftNumber;
    const date = moment('2023.02.21T10:20', DATE_FORMAT).toDate();
    const aircrafts = [aircraft4, aircraft2];
    const pilots: Array<PilotShort> = [person2, person3].map(it => ({
        firstName: it.firstName,
        patronimyc: it.patronimyc,
        lastName: it.lastName,
    } as PilotShort));
    const airfields = [aircraft5];
    const recipient = pilot4Actor;
    const target = '1234567';
    const zoneDescription = 'АБВГД 1234567 ЕЁЖЗ';
    const createDate = moment('2022.12.20', DATE_FORMAT).toDate();
    const startDate = moment('2023.02.10', DATE_FORMAT).toDate();
    const endDate = moment('2023.05.10', DATE_FORMAT).toDate();

    // const result = await getPermissionKsaPivp(null, person2, date, aircraft2)
    // console.log('result', result);

    // const p = await getPilotsWithEmptyPermissionNumber([person2, person3, person1]);
    // const p = await getPermission(permission3.id);
    // console.log('p', p);

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
