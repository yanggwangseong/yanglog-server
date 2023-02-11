import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = process.env.ROLES_KEY;
export const Roles = (...args: string[]) => SetMetadata(ROLES_KEY, args);
