import { CurrentUserRequest } from '@common/decorators/current-user.decorator';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export function UserGetMeSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current authenticated user' }),
    ApiResponse({
      status: 200,
      description: 'User in request details returned successfully',
      type: CurrentUserRequest,
    }),
  );
}

export function UserFindAllSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({
      status: 200,
      description: 'List of all users',
      type: [UserResponse],
    }),
  );
}
