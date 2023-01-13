import {
  Controller,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor() { }
}
