import { UserIdInRequest } from '@auth/jwt/jwt.types';

/**
 * Interface for authenticated requests.
 * Contains the user object.
 * @summary jwt strategy validate function adds the user object to the Request object from nest common.
 */
export interface AuthenticatedRequest extends Request {
  user: UserIdInRequest;
}
