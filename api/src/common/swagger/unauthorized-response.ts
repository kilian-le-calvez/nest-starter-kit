import { UnauthorizedException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse extends UnauthorizedException {
  @ApiProperty({
    description: 'The message of the response',
    example: 'Unauthorized. Invalid or expired token.',
  })
  message: string;

  @ApiProperty({
    description: 'The error message of the response',
    example: 'Unauthorized',
  })
  error: string;

  @ApiProperty({
    description: 'The status code of the response',
    example: 401,
  })
  statusCode: number;
}
