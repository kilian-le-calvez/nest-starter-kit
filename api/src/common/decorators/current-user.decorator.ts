import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export class CurrentUserRequest {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({ description: 'The email address of the user' })
  email: string;
}
