import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma/prisma.service';
import { Res1Module } from './res1/res1.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [Res1Module
    , PostModule
    , UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService, PrismaService
  ],
})
export class AppModule { };
