import { BadRequestException, Delete, Header, Logger, ParseIntPipe, Post, Req, Res, } from '@nestjs/common';
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
import { KsaPivpPermissionDetailedResponse, KsaPivpPermissionRequestDto, KsaPivpPermissionResponse, PermissionDto } from './dto/permission'
import { SimpleResponse } from 'src/utils';
import { Response } from 'supertest';
import getRawBody from 'raw-body';

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
    @Get(':id')
    async getPermissionById(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
        const result = await this.permissionService.getPermissionById(id);
        if (!result) {
            throw new NotFoundException(`Разрешение с id=${id} не существует!`);
        }
        return result;
    }

    @ApiResponse({ status: 200, description: 'Возвращает разрешение на полёт для KCA ПиВП', schema: { $ref: getSchemaPath(PermissionDto) } })
    @ApiResponse({ status: 404, description: 'Разрешение не найдено', })
    @Post('/findKsaPivpPermission')
    async getPermissionByKsaPivpRequest(
        @Body() ksaPivpRequest: KsaPivpPermissionRequestDto,
        @Req() request
    ): Promise<KsaPivpPermissionResponse> {
        const responseObject = await this.permissionService.checkPermissionByKsaPivpRequest(ksaPivpRequest);

        if (responseObject.result === true) {
            return responseObject;
        } else if (responseObject.result === false) {
            throw new NotFoundException(`Разрешение с критерием=${JSON.stringify(ksaPivpRequest)} не существует!`);
        }

        throw new BadRequestException(`Ошибка при поиске разрешения с критерием=${JSON.stringify(ksaPivpRequest)}`);
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
    @ApiResponse({ status: 400, description: 'Ошибка при удалении разрешения', })
    @ApiResponse({ status: 404, description: 'Разрешение не найдено по его внутреннему id', })
    @Delete(':id')
    @Get('delete/:id')
    @Header('Content-Type', 'application/json')
    async removePermissionById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<SimpleResponse> {
        let result: boolean | undefined;

        try {
            result = await this.permissionService.deletePermissionById(id);
        } catch (e) {
            this.logger.error(`Ошибка при удалении разрешения с id=${id}! Exception: ${e}`);
            throw new BadRequestException(`Ошибка при удалении разрешения с id=${id}!`);
        }

        if (result === undefined) {
            this.logger.error(`Разрешение с id=${id} не существует!`);
            throw new NotFoundException(`Разрешение с id=${id} не существует!`);
        } else if (result === false) {
            throw new BadRequestException(`Ошибка при удалении разрешения с id=${id}!`);
        }

        return { result: !!result } as SimpleResponse;
    }
}
