import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete
} from '@nestjs/common';
import { AppService } from './app.service';
// import { UserService } from './PrismaService/user.service';
// import { PostService } from './PrismaService/post.service';

import { User1 as UserModel, Post as PostModel } from '@prisma/client';

import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

// type UserData = { email: string; name?: string };

// type PostData = {
//   title: string;
//   content?: string;
//   authorEmail: string;
// };

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly userService: UserService,
    // private readonly postService: PostService,
  ) { }

  @ApiResponse({ status: 200, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('post/:id')
  // async getPostById(@Param('id') id: string): Promise<PostModel> {
  //   return this.postService.post({ id: Number(id) });
  // }

  // @Get('feed')
  // async getPublishedPosts(): Promise<PostModel[]> {
  //   return this.postService.posts({
  //     where: {
  //       published: true,
  //     },
  //   });
  // }

  // @Get('filtered-posts/:searchString')
  // async getFilteredPosts(
  //   @Param('searchString') searchString: string,
  // ): Promise<PostModel[]> {
  //   return this.postService.posts({
  //     where: {
  //       OR: [
  //         {
  //           title: { contains: searchString },
  //         },
  //         {
  //           content: { contains: searchString },
  //         },
  //       ],
  //     },
  //   });
  // }

  // @Post('post')
  // async createDraft(@Body() postData: PostData): Promise<PostModel> {
  //   const { title, content, authorEmail } = postData;

  //   return this.postService.createPost({
  //     title,
  //     content,
  //     author: {
  //       connect: { email: authorEmail },
  //     },
  //   });
  // }

  // @Put('publish/:id')
  // async publishPost(@Param('id') id: string): Promise<PostModel> {
  //   return this.postService.updatePost({
  //     where: { id: Number(id) },
  //     data: { published: true },
  //   });
  // }

  // @Delete('post/:id')
  // async removePost(@Param('id') id: string): Promise<PostModel> {
  //   return this.postService.removePost({ id: Number(id) });
  // }

  // @Post('user')
  // async registerUser(@Body() userData: UserData): Promise<UserModel> {
  //   return this.userService.createUser(userData);
  // }
}
