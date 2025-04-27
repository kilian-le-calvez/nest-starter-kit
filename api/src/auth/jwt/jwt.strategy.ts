import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JWTPayloadUser, UserIdInRequest } from './jwt.types';

/* The JwtStrategy class in TypeScript is used to validate JWT payloads by checking necessary fields
and fetching user details based on the payload ID. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        // Extract token from Authorization header
        let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        // If token not found in headers, try cookies
        if (!token && req.cookies) {
          token = req.cookies['jwt'];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * The function validates a JWT payload by checking for necessary fields
   * @param {JWTPayloadUser} payload - The `JWTPayloadUser` represents a JWT (JSON Web Token) payload for a user.
   * @returns The `validate` function is returning an object with the user `id`
   */
  async validate(payload: JWTPayloadUser): Promise<UserIdInRequest> {
    // Ensure payload has necessary fields
    if (!payload || !payload.sub) {
      console.error('Invalid JWT payload');
      throw new UnauthorizedException('Invalid token');
    }

    return { id: payload.sub };
  }
}
