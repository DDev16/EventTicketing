import React, { useState, useEffect } from 'react';
import { agent } from '../IdentityCheck';

const IdentityVerification = () => {
  const [didDoc, setDidDoc] = useState(null);

  const resolveIdentity = async () => {
    const doc = await agent.resolveDid({
      didUrl: 'did:ethr:goerli:0x6acf3bb1ef0ee84559de2bc2bd9d91532062a730',
    });

    setDidDoc(doc);
  };

  useEffect(() => {
    resolveIdentity();
  }, []);

  return (
    <div>
      <h2>Identity Verification</h2>
      {didDoc ? (
        <pre>{JSON.stringify(didDoc, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default IdentityVerification;
