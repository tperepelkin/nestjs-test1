import { Injectable, OnModuleInit } from '@nestjs/common';
// преимущество использования `Prisma` в `TypeScript-проекте` состоит в том,
// что `Prisma` автоматически генерирует типы для моделей и их вариаций
import { User1, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService implements OnModuleInit {
  async onModuleInit() {
    console.log('Init UserService');
  }
  // внедряем зависимость
  constructor(
    private prisma: PrismaService,
  ) { }

  // получение пользователя по email
  async user(where: Prisma.User1WhereUniqueInput): Promise<User1 | null> {
    return this.prisma.user1.findUnique({
      where,
    });
  }

  // получение всех пользователей
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.User1WhereUniqueInput;
    where?: Prisma.User1WhereInput;
    orderBy?: Prisma.User1OrderByWithRelationInput;
  }): Promise<User1[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user1.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  // создание пользователя
  async createUser(data: Prisma.User1CreateInput): Promise<User1> {
    return this.prisma.user1.create({ data });
  }

  // обновление пользователя
  async updateUser(params: {
    where: Prisma.User1WhereUniqueInput;
    data: Prisma.User1UpdateInput;
  }): Promise<User1> {
    const { where, data } = params;
    return this.prisma.user1.update({
      data,
      where,
    });
  }

  // удаление пользователя
  async removeUser(where: Prisma.User1WhereUniqueInput): Promise<User1> {
    return this.prisma.user1.delete({ where });
  }
}