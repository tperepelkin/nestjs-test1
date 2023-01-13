import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Res1Service } from './res1.service';
import { CreateRes1Dto } from './dto/create-res1.dto';
import { UpdateRes1Dto } from './dto/update-res1.dto';

@Controller('res1')
export class Res1Controller {
  constructor(private readonly res1Service: Res1Service) {}

  @Post()
  create(@Body() createRes1Dto: CreateRes1Dto) {
    return this.res1Service.create(createRes1Dto);
  }

  @Get()
  findAll() {
    return this.res1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.res1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRes1Dto: UpdateRes1Dto) {
    return this.res1Service.update(+id, updateRes1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.res1Service.remove(+id);
  }
}
