import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@common/constants/app.constants';
import { Role } from '@common/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
