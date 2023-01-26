import { BadRequestException, Delete, Logger, ParseIntPipe, Post, } from '@nestjs/common';
import {
    Controller,
    Get,
    Param,
    Body
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { PermissionsService } from './permissions-service';
import { Permission } from '@prisma/client';
import { PermissionDto } from './dto/permission'

type ResultOk = {
    result: boolean;
}

@Controller('permissions')
export class PermissionsController {
    private readonly logger = new Logger(PermissionsController.name);

    constructor(
        private readonly permissionService: PermissionsService
    ) { }

    // async getAdsb(@Body('targetIdent') targetIdent: string): Promise<IAdsbData> {
    //     const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
    //     if (!result) {
    //         throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
    //     }
    //     return result;
    // }

    // @ApiExtraModels(AdsbData)
    // @ApiResponse({ status: 200, description: 'Возвращает БВС по его targetIdent, найденный среди данных от источников ADSB', schema: { $ref: getSchemaPath(AdsbData) } })
    // @ApiResponse({ status: 404, description: 'Когда БВС не найден по заданному targetIdent среди данных от источников ADSB', })
    // @Get('adsb/byIdent/:targetIdent')
    // async getAdsbByTargetIdent(@Param('targetIdent') targetIdent: string): Promise<IAdsbData> {
    //     const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
    //     if (!result) {
    //         throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
    //     }
    //     return result;
    // }

    @ApiResponse({ status: 200, description: 'Возвращает список всех БВС от источников ADSB', schema: { $ref: getSchemaPath(PermissionDto) } })
    @Get()
    async getAllPermissions(): Promise<Array<Permission>> {
        return this.permissionService.getAllPermissions();
    }

    @ApiResponse({ status: 200, description: 'Возвращает разрешение на полёт по его внутреннему id', schema: { $ref: getSchemaPath(PermissionDto) } })
    @ApiResponse({ status: 404, description: 'Разрешение не найдено по его внутреннему id', })
    @Get('/:id')
    async getPermissionById(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
        const result = await this.permissionService.getPermissionById(id);
        this.logger.log('Found', result);
        if (!result) {
            throw new NotFoundException(`Разрешение с id=${id} не существует!`);
        }
        return result;
    }


    // @Post('/create/:id')
    // @Get('/create/:id')
    // async addPermissionById(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
    //     const result = this.permissionService.getPermissionById(id);
    //     this.logger.log('Found', result);
    //     if (!result) {
    //         throw new NotFoundException(`Разрешение с id=${id} не существует!`);
    //     }
    //     return result;
    // }

    @ApiResponse({ status: 200, description: 'Удаляет разрешение на полёт по его внутреннему id', schema: { $ref: getSchemaPath(PermissionDto) } })
    @ApiResponse({ status: 400, description: 'Разрешение не найдено по его внутреннему id', })
    // @Delete('/:id')
    @Get('/delete/:id')
    async removePermissionById(@Param('id', ParseIntPipe) id: number): Promise<ResultOk> {
        const result = await this.permissionService.deletePermissionById(id);
        if (!result) {
            throw new BadRequestException(`Разрешение с id=${id} не удалено!`);
        }
        return { result } as ResultOk;
    }

}
