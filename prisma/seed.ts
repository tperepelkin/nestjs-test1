import {
    ActorType
    , Individual
    , PrismaClient
    , User
    , Aircraft
    , Actor
    , AircraftType
} from '@prisma/client';
import { v4 as uuid4 } from 'uuid';

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

// async function getNextPermissionNumber(): Promise<number> {
//     const nextValue = await prisma.permission.aggregate({
//         _max: {
//             permissionNumber: true,
//         }
//     });
//     return nextValue + 1;
// }
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
    pilots: Individual[],
    owner: Actor
) {
    return await prisma.aircraft.upsert({
        where: {
            aircraftNumber,
        },
        update: {},
        create: {
            aircraftNumber,
            modelName,
            pilots: {
                connect: pilots.map(it => ({
                    id: it.id,
                })),
            },
            owner: {
                connect: {
                    id: owner.id,
                }
            },
            aircraftType,
        },
        include: {
            pilots: true,
            owner: true,
        },
    })
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

    return await prisma.actor.create({ data, });
}

async function main() {
    const engeneerGroup = await prisma.role.upsert({
        where: {
            name: ENGENEER_GROUP_NAME,
        },
        update: {},
        create: {
            name: ENGENEER_GROUP_NAME,
            comment: 'роль администратора',
        }
    });
    const dispatcherGroup = await prisma.role.upsert({
        where: {
            name: DISPATCHER_GROUP_NAME,
        },
        update: {},
        create: {
            name: DISPATCHER_GROUP_NAME,
            comment: 'роль диспетчера',
        }
    });
    const pilotGroup = await prisma.role.upsert({
        where: {
            name: PILOT_GROUP_NAME,
        },
        update: {},
        create: {
            name: PILOT_GROUP_NAME,
            comment: 'роль внешнего пилота',
        }
    });
    const ownerGroup = await prisma.role.upsert({
        where: {
            name: OWNER_GROUP_NAME,
        },
        update: {},
        create: {
            name: OWNER_GROUP_NAME,
            comment: 'роль владельца воздушного судна',
        }
    });

    const engeneer1 = await prisma.user.upsert({
        where: {
            login: BASE_ENGENEER_LOGIN_NAME,
        },
        update: {},
        create: {
            login: BASE_ENGENEER_LOGIN_NAME,
            password: 'password',
            roles: {
                connect: [{ id: engeneerGroup.id }],
            }
        },
    });

    const dispatcher1 = await prisma.user.upsert({
        where: {
            login: TEST_FIRST_DISPATCHER_LOGIN_NAME,
        },
        update: {},
        create: {
            login: TEST_FIRST_DISPATCHER_LOGIN_NAME,
            password: 'password',
            roles: {
                connect: [{ id: dispatcherGroup.id }],
            }
        },
    });

    const pilot1 = await prisma.user.upsert({
        where: {
            login: TEST_FIRST_PILOT_LOGIN_NAME,
        },
        update: {},
        create: {
            login: TEST_FIRST_PILOT_LOGIN_NAME,
            password: 'password',
            wrongAttempts: 0,
            roles: {
                connect: [{ id: pilotGroup.id }],
            }
        },
    });

    const pilot2 = await prisma.user.upsert({
        where: {
            login: TEST_SECOND_PILOT_LOGIN_NAME,
        },
        update: {},
        create: {
            login: TEST_SECOND_PILOT_LOGIN_NAME,
            password: 'password',
            roles: {
                connect: [{ id: pilotGroup.id }, { id: ownerGroup.id }],
            }
        },
    });

    const owner1: User = await prisma.user.upsert({
        where: {
            login: TEST_OWNER_LOGIN_NAME,
        },
        update: {},
        create: {
            login: TEST_OWNER_LOGIN_NAME,
            password: 'password',
            roles: {
                connect: [{ id: ownerGroup.id }],
            }
        },
    });



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
    console.log(ownerPerson1);
    addActor(ownerPerson1, owner1);
    // addActor(engenierPerson1, engeneer1);
    // addActor(pilotPerson1, pilot1);
    // addActor(pilotPerson2, pilot2);
    // addActor(dispatcherPerson1, dispatcher1);

    // prisma.permission.create({
    //     data: {
    //         permissionNumber: Math.random().toString().substring(2, 10)
    //     }
    // });

    // const person = await prisma.individual.findFirst({
    //     where: {
    //         firstName: 'Повелитель',
    //         lastName: 'Беспилотников',
    //     },
    //     include: {
    //         actor: {
    //             include: {
    //                 user: true,
    //             }
    //         }
    //     }
    // });
    // console.log(person);
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

