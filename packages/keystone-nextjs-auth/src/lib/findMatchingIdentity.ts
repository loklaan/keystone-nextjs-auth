import type { KeystoneListsAPI } from '@keystone-next/keystone/types';

import { AuthTokenRequestErrorCode } from '../types';

export async function findMatchingIdentity(
  identityField: string,
  identity: string,
  itemAPI: KeystoneListsAPI<any>[string]
): Promise<
  | { success: false; code: AuthTokenRequestErrorCode }
  | { success: true; item: any }
> {
  const items = await itemAPI.findMany({
    where: { [identityField]: { equals: identity } },
    resolveFields: false,
  });

  // Identity failures with helpful errors
  let code: AuthTokenRequestErrorCode | undefined;
  if (items.length === 0) {
    code = 'IDENTITY_NOT_FOUND';
  } else if (items.length > 1) {
    code = 'MULTIPLE_IDENTITY_MATCHES';
  }
  if (code) {
    return { success: false, code };
  }
  return { success: true, item: items[0] };
}
