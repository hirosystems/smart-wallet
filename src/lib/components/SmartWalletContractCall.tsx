import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
} from '@stacks/transactions';
import React, { useEffect, useState } from 'react';

import { userSession } from './ConnectWallet';

const SmartWalletContractCall = () => {
  const { doContractCall } = useConnect();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function vote(pick) {}

  if (!mounted || !userSession.isUserSignedIn()) {
    return null;
  }

  return (
    <div>
      <h3>Vote via Smart Contract</h3>
      <button className="Vote" onClick={() => vote('🍊')}>
        Vote for 🍊
      </button>
      <button className="Vote" onClick={() => vote('🍎')}>
        Vote for 🍎
      </button>
    </div>
  );
};

export default SmartWalletContractCall;
