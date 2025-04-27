import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * The `Public` function is used to set metadata indicating that a route or endpoint is public.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
