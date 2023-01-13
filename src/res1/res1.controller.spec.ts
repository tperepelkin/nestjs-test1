import { Test, TestingModule } from '@nestjs/testing';
import { Res1Controller } from './res1.controller';
import { Res1Service } from './res1.service';

describe('Res1Controller', () => {
  let controller: Res1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Res1Controller],
      providers: [Res1Service],
    }).compile();

    controller = module.get<Res1Controller>(Res1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
