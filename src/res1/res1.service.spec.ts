import { Test, TestingModule } from '@nestjs/testing';
import { Res1Service } from './res1.service';

describe('Res1Service', () => {
  let service: Res1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Res1Service],
    }).compile();

    service = module.get<Res1Service>(Res1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
