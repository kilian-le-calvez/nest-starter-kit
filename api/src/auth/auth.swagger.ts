import { applyDecorators } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import {
  ApiOperation,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { ClassValidatorPostSwagger } from '@common/swagger/class-validator-post.swagger';
import { UnauthorizedResponse } from '@common/swagger/unauthorized-response';

class InvalidCredentialsResponse extends UnauthorizedResponse {
  @ApiProperty({
    description: 'The message of the response',
    example: 'Invalid credentials',
  })
  message: string;
}

export function AuthRegisterSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiCreatedResponse({
      description: 'The user has been successfully registered',
      example:
        'Your account has been created successfully with email: user@example.com',
    }),
    ApiConflictResponse({ description: 'Email is already registered' }),
    ClassValidatorPostSwagger(RegisterDto),
  );
}

export function AuthLoginSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Login and set JWT in cookie' }),
    ApiResponse({
      status: 200,
      description: 'Login successful and cookie set',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      type: InvalidCredentialsResponse,
    }),
    ClassValidatorPostSwagger(LoginDto),
  );
}
