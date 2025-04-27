import { ApiProperty } from '@nestjs/swagger';

/* The code snippet is defining an interface named `JWTPayloadUser` in TypeScript. This interface
specifies the structure of the JWT payload for a user. It includes the `username`, `email`, and `sub`
properties. */
export interface JWTPayloadUser {
  sub: number;
}

export class JWT {
  @ApiProperty({
    description: 'JWT token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  jwt: string;
}

export interface UserIdInRequest {
  id: number;
}
