import { createAgent } from '@veramo/agent';
import { IResolver } from '@veramo/core-types';

import { DIDResolverPlugin } from '@veramo/did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';

const INFURA_PROJECT_ID = 'e05c62fc4aa741d2bcd495d014fe9060';

export const agent = createAgent<IResolver>({
  plugins: [
    new DIDResolverPlugin({
      ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
      ...webDidResolver(),
    }),
  ],
});
