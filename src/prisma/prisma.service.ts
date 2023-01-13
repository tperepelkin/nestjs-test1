import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // подключаемся к БД при инициализации модуля
    console.log('Connect PrismaService to prisma');
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      // закрываем приложение при отключении от БД
      console.log('Disconnect PrismaService to prisma');
      await app.close();
    });
  }
}
