import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { VerifyErrors } from 'jsonwebtoken';

/* The JwtAuthGuard class is an Injectable class that extends AuthGuard('jwt') and handles requests by
checking for errors or unauthorized access. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * The function checks if a route is public or not and returns true if it is public, otherwise calls the
   * parent class's canActivate method.
   * @param {ExecutionContext} context - The context of the current request being handled by the guard.
   * @returns A boolean value indicating whether the route is public or not.
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  /**
   * The function `handleRequest` handles errors and unauthorized access in a JWT guard implementation.
   * @param {VerifyErrors | null} err
   * @param {any} user
   * @param {Error | string | undefined} info
   * @returns The `user` object is being returned.
   */
  handleRequest(
    err: VerifyErrors | null,
    user: any,
    info: Error | string | undefined,
  ) {
    if (err || !user) {
      console.error('JWT Guard Error:', err || info);
      throw (
        err ||
        new UnauthorizedException('Unauthorized. Invalid or expired token.')
      );
    }
    return user;
  }
}
