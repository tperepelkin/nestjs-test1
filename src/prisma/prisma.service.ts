import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // подключаемся к БД при инициализации модуля
    this.logger.log('Connect PrismaService to prisma');
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      // закрываем приложение при отключении от БД
      this.logger.log('Disconnect PrismaService to prisma');
      await app.close();
    });
  }
}
