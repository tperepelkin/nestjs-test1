import {
    Controller,
    Get,
    Param,
    Body,
    UseGuards,
    SetMetadata,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import IAdsbData, { AdsbData } from './dto/adsb-client-data';
import { RadarInfoService } from './radar-info.service';
import { NotFoundException } from '@nestjs/common'
import {
    ApiExtraModels
    , ApiNotFoundResponse
    , ApiOkResponse
    , getSchemaPath
    , ApiOperation
    , ApiParam
    , ApiForbiddenResponse
} from '@nestjs/swagger'
import { Roles } from 'src/permissions/decorators/roles.decorator';

@Controller('radar')
export class RadarInfoController implements CanActivate {
    constructor(
        private readonly radarService: RadarInfoService,
        private reflector: Reflector
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('User', user);

        // By default throws ForbiddenException
        // if (roles.includes(user))  {
        //     throw new UnauthorizedException();
        // }

        return true;
    }

    // async getAdsb(@Body('targetIdent') targetIdent: string): Promise<IAdsbData> {
    //     const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
    //     if (!result) {
    //         throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
    //     }
    //     return result;
    // }

    // async getAllPermissions(): Promise<any> {
    //     const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
    //     if (!result) {
    //         throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
    //     }
    //     return result;
    // }

    /**
     * Возвращает информацию о воздушном судне по его идентификатору
     * @param targetIdent код ICAO воздушного судна @example ['SBI1211']
     * @returns 
     */
    @ApiExtraModels(AdsbData)
    @ApiOkResponse({
        description: '200. Возвращает БВС по его targetIdent, найденный среди данных от источников ADSB',
        schema: { $ref: getSchemaPath(AdsbData) }
    })
    @ApiNotFoundResponse({
        description: '404. Когда БВС не найден по заданному targetIdent среди данных от источников ADSB',
    })
    @Roles('admin')
    @Get('adsb/byIdent/:targetIdent')
    async getAdsbByTargetIdent(@Param('targetIdent') targetIdent: string): Promise<IAdsbData> {
        const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
        if (!result) {
            throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
        }
        return result;
    }

    @ApiOkResponse({
        description: '200. Возвращает БВС по его targetAddress, найденный среди данных от источников ADSB',
        schema: { $ref: getSchemaPath(AdsbData) }
    })
    @ApiNotFoundResponse({
        description: '404. Когда БВС не найден по заданному targetAddress среди данных от источников ADSB',
    })
    @Get('adsb/byAddress/:targetAddress')
    async getAdsbByTargetAddress(@Param('targetAddress') targetAddress: number): Promise<IAdsbData> {
        const result = this.radarService.getAdsbByTargetAddress(targetAddress);
        if (!result) {
            throw new NotFoundException(`Adsb with target address ${targetAddress} was not found`);
        }
        return result;
    }

    @ApiOkResponse({
        description: '200. Возвращает список всех БВС от источников ADSB', schema: { $ref: getSchemaPath(AdsbData) }
    })
    @Get('adsb')
    async getAllAdsb(): Promise<IAdsbData[]> {
        return this.radarService.getAllAdsb();
    }

    // @Get('filtered-posts/:searchString')
    // async getFilteredPosts(
    //     @Param('searchString') searchString: string,
    // ): Promise<PostModel[]> {
    //     return this.postService.posts({
    //         where: {
    //             OR: [
    //                 {
    //                     title: { contains: searchString },
    //                 },
    //                 {
    //                     content: { contains: searchString },
    //                 },
    //             ],
    //         },
    //     });
    // }

    // @Post('post')
    // async createDraft(@Body() postData: PostData): Promise<PostModel> {
    //     const { title, content, authorEmail } = postData;

    //     return this.postService.createPost({
    //         title,
    //         content,
    //         author: {
    //             connect: { email: authorEmail },
    //         },
    //     });
    // }

    // @Put('publish/:id')
    // async publishPost(@Param('id') id: string): Promise<PostModel> {
    //     return this.postService.updatePost({
    //         where: { id: Number(id) },
    //         data: { published: true },
    //     });
    // }

    // @Delete('post/:id')
    // async removePost(@Param('id') id: string): Promise<PostModel> {
    //     return this.postService.removePost({ id: Number(id) });
    // }
}
