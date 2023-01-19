import {
    ActorType
    , Individual
    , PrismaClient
} from '@prisma/client';

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
            // firstName: 'Инженер',
            // lastName: 'Администраторов',
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
            // firstName: 'Диспетчер',
            // lastName: 'Бэвээсов',
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
            // firstName: 'Первый Пилот',
            // lastName: 'Летунов',
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
            // firstName: 'Второй Пилот',
            // lastName: 'Летунович',
            roles: {
                connect: [{ id: pilotGroup.id }, { id: ownerGroup.id }],
            }
        },
    });

    const owner1 = await prisma.user.upsert({
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

    let ownerPerson1: Individual = await prisma.individual.findFirst({
        where: {
            firstName: 'Повелитель',
            lastName: 'Беспилотников',
            patronimyc: 'Батькович',
        },
    });
    if (!ownerPerson1) {
        ownerPerson1 = await prisma.individual.create({
            data: {
                firstName: 'Повелитель',
                lastName: 'Беспилотников',
                patronimyc: 'Батькович',
                passportSeries: '1234',
                passportNumber: '123456',
                address: '',
                passportSource: '',
                actor: {
                    create: {
                        type: ActorType.USER,
                        user: {
                            connect: {
                                id: owner1.id
                            }
                        }
                    }
                },
            },
            include: {
                actor: {
                    include: {
                        user: true,
                    }
                }
            }
        });
    }

    console.log(ownerPerson1);
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

