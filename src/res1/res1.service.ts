import { Injectable } from '@nestjs/common';
import { CreateRes1Dto } from './dto/create-res1.dto';
import { UpdateRes1Dto } from './dto/update-res1.dto';

@Injectable()
export class Res1Service {
  create(createRes1Dto: CreateRes1Dto) {
    return 'This action adds a new res1';
  }

  findAll() {
    return `This action returns all res1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} res1`;
  }

  update(id: number, updateRes1Dto: UpdateRes1Dto) {
    return `This action updates a #${id} res1`;
  }

  remove(id: number) {
    return `This action removes a #${id} res1`;
  }
}
