import { PartialType } from '@nestjs/swagger';
import { CreateRes1Dto } from './create-res1.dto';

export class UpdateRes1Dto extends PartialType(CreateRes1Dto) {}
