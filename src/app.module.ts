import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionsModule } from './permissions/permissions.module';
import { PrismaModule } from './prisma/prisma.module';
import { RadarInfoModule } from './radar-info/radar-info.module';

@Module({
  imports: [
    RadarInfoModule,
    PermissionsModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { };
