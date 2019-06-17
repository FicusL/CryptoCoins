import { ReflectMetadata } from '@nestjs/common';

export const AccountAccessParam = (accountIdParam: string) => ReflectMetadata('AccountAccessParam', accountIdParam);