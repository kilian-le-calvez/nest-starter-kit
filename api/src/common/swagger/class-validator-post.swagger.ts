import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody } from '@nestjs/swagger';

export function ClassValidatorPostSwagger(dto: any) {
  return applyDecorators(
    ApiBody({ type: dto }),
    ApiBadRequestResponse({
      description: 'Validation failed. Check the input data.',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'xxy must be an xxx',
            'yyy must be longer than or equal to Z characters',
            'xx1 should not exists',
          ],
          error: 'Bad Request',
        },
      },
    }),
  );
}
