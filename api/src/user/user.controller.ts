import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserRequest,
} from '@common/decorators/current-user.decorator';
import { UserResponse } from './user.response';
import { JWTUnauthorizedSwagger } from '@common/swagger/jwt-unauthorized.swagger';
import { UserFindAllSwagger, UserGetMeSwagger } from './user.swagger';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';

@ApiTags('users')
@JWTUnauthorizedSwagger()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UserGetMeSwagger()
  getMe(@CurrentUser() user: CurrentUserRequest): Promise<UserResponse> {
    return this.userService.findById(user.id);
  }

  @Get()
  @UserFindAllSwagger()
  findAll(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }
}
