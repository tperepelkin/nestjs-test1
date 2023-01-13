import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

type GetPostsParams = {
  skip?: number;
  take?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
};

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // получение поста по id
  async post(where: Prisma.PostWhereUniqueInput): Promise<Post | null> {
    return this.prisma.post.findUnique({ where });
  }

  // получение всех постов
  async posts(params: GetPostsParams) {
    return this.prisma.post.findMany(params);
  }

  // создание поста
  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  // обновление поста
  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    return this.prisma.post.update(params);
  }

  // удаление поста
  async removePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({ where });
  }
}