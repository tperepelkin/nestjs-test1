import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions-service';
import { PermissionsRepository } from './permissions-repository';

@Module({
    imports: [PrismaModule],
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionsRepository],
    exports: [],
})
export class PermissionsModule { };