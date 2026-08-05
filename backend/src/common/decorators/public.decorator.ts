import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '@common/constants/app.constants';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
