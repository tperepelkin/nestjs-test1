import { Body, Controller, Post } from '@nestjs/common';
import { UserData } from './dto/user';
import { UserService } from './user.service';
import { User1 as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post('user')
    async registerUser(@Body() userData: UserData): Promise<UserModel> {
        return this.userService.createUser(userData);
    }
}
