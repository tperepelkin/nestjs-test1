import {
    Controller,
    Get,
    Param,
    Body
} from '@nestjs/common';
import IAdsbData, { AdsbData } from './dto/adsb-client-data';
import { RadarInfoService } from './radar-info.service';
import { NotFoundException } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

@Controller('radar')
export class RadarInfoController {
    constructor(
        private readonly radarService: RadarInfoService
    ) { }

    // async getAdsb(@Body('targetIdent') targetIdent: string): Promise<IAdsbData> {
    //     const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
    //     if (!result) {
    //         throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
    //     }
    //     return result;
    // }

    async getAllPermissions(): Promise<any> {
        const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
        if (!result) {
            throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
        }
        return result;
    }

    @ApiExtraModels(AdsbData)
    @ApiResponse({ status: 200, description: 'Возвращает БВС по его targetIdent, найденный среди данных от источников ADSB', schema: { $ref: getSchemaPath(AdsbData) } })
    @ApiResponse({ status: 404, description: 'Когда БВС не найден по заданному targetIdent среди данных от источников ADSB', })
    @Get('adsb/byIdent/:targetIdent')
    async getAdsbByTargetIdent(@Param('targetIdent') targetIdent: string): Promise<IAdsbData> {
        const result = await this.radarService.getAdsbByTargetIdent(targetIdent);
        if (!result) {
            throw new NotFoundException(`Adsb with target ident ${targetIdent} was not found`);
        }
        return result;
    }

    @ApiResponse({ status: 200, description: 'Возвращает БВС по его targetAddress, найденный среди данных от источников ADSB', schema: { $ref: getSchemaPath(AdsbData) } })
    @ApiResponse({ status: 404, description: 'Когда БВС не найден по заданному targetAddress среди данных от источников ADSB', })
    @Get('adsb/byAddress/:targetAddress')
    async getAdsbByTargetAddress(@Param('targetAddress') targetAddress: number): Promise<IAdsbData> {
        const result = this.radarService.getAdsbByTargetAddress(targetAddress);
        if (!result) {
            throw new NotFoundException(`Adsb with target address ${targetAddress} was not found`);
        }
        return result;
    }

    @ApiResponse({ status: 200, description: 'Возвращает список всех БВС от источников ADSB', schema: { $ref: getSchemaPath(AdsbData) } })
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
