import { Module } from '@nestjs/common';
import { Res1Service } from './res1.service';
import { Res1Controller } from './res1.controller';

@Module({
  controllers: [Res1Controller],
  providers: [Res1Service]
})
export class Res1Module {}
