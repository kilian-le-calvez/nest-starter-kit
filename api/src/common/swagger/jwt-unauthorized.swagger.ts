import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedResponse } from './unauthorized-response';

export function JWTUnauthorizedSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. Invalid or expired token.',
      type: UnauthorizedResponse,
    }),
  );
}
