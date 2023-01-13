import { PrismaClient, UserGroup, User, Group } from '@prisma/client';
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

const addUserToGroup = async (user: User, group: Group): Promise<UserGroup> => {
    const result = await prisma.userGroup.upsert({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId: group.id,
            },
        },
        update: {},
        create: {
            user: {
                connect: {
                    id: user.id,
                },
            },
            group: {
                connect: {
                    id: group.id,
                }
            }
        },
    });

    return result;
};

async function main() {
    const engeneerGroup = await prisma.group.upsert({
        where: {
            name: ENGENEER_GROUP_NAME,
        },
        update: {},
        create: {
            name: ENGENEER_GROUP_NAME,
            comment: 'группа администраторов',
        }
    });
    const dispatcherGroup = await prisma.group.upsert({
        where: {
            name: DISPATCHER_GROUP_NAME,
        },
        update: {},
        create: {
            name: DISPATCHER_GROUP_NAME,
            comment: 'группа диспетчеров',
        }
    });
    const pilotGroup = await prisma.group.upsert({
        where: {
            name: PILOT_GROUP_NAME,
        },
        update: {},
        create: {
            name: PILOT_GROUP_NAME,
            comment: 'группа внешних пилотов',
        }
    });
    const ownerGroup = await prisma.group.upsert({
        where: {
            name: OWNER_GROUP_NAME,
        },
        update: {},
        create: {
            name: OWNER_GROUP_NAME,
            comment: 'группа владельцев беспитлотников',
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
            firstName: 'Инженер',
            lastName: 'Администраторов',
            wrongAttempts: 0,
            groups: {
                create: [],
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
            firstName: 'Диспетчер',
            lastName: 'Бэвээсов',
            wrongAttempts: 0,
            groups: {
                create: [],
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
            firstName: 'Первый Пилот',
            lastName: 'Летунов',
            wrongAttempts: 0,
            groups: {
                create: [],
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
            firstName: 'Второй Пилот',
            lastName: 'Летунович',
            wrongAttempts: 0,
            groups: {
                create: [],
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
            firstName: 'Повелитель',
            lastName: 'Беспилотников',
            wrongAttempts: 0,
            groups: {
                create: [],
            }
        },
    });

    // Добавим базовый пользователю роль администратора
    const engeneer1GroupLink1 = addUserToGroup(engeneer1, engeneerGroup);
    // Добавим пользователю-диспетчеру роль диспетчера
    const dispatcher1GroupLink1 = addUserToGroup(dispatcher1, dispatcherGroup);
    // Добавим пользователю, первому пилоту, роль пилота
    const pilot1GroupLink1 = addUserToGroup(pilot1, pilotGroup);
    // Добавим пользователю, второму пилоту, роль пилота
    const pilot2GroupLink1 = addUserToGroup(pilot2, pilotGroup);
    // Добавим пользователю, владельцу БПЛА, роль владельца
    const owner1GroupLink1 = addUserToGroup(owner1, ownerGroup);
    // Добавим пользователю, владельцу БПЛА, роль пилота
    const owner1GroupLink2 = addUserToGroup(owner1, pilotGroup);

    const user = await prisma.user.findUnique({
        where: {
            login: TEST_OWNER_LOGIN_NAME,
        },
        select: {
            login: true,
            groups: {
                select: {
                    group: {
                        select: {
                            name: true,
                            comment: true,
                        },
                    },
                },
            },
        },
    });
    console.log(JSON.stringify(user, null, 2));
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