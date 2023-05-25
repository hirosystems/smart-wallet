import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useCurrentNetwork } from '../hooks/use-current-network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

interface HiroWallet {
  isWalletOpen: boolean;
  isWalletConnected: boolean;
  testnetAddress: string | null;
  mainnetAddress: string | null;
  devnetAddress: string | null;
  currentAddress: string | null;
  authenticate: () => void;
  disconnect: () => void;
}

const HiroWalletContext = createContext<HiroWallet>({
  isWalletOpen: false,
  isWalletConnected: false,
  testnetAddress: null,
  mainnetAddress: null,
  devnetAddress: null,
  currentAddress: null,
  authenticate: () => {},
  disconnect: () => {},
});
export default HiroWalletContext;

interface ProviderProps {
  children: ReactNode | ReactNode[];
}
export const HiroWalletProvider: FC<ProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(
    mounted && userSession.isUserSignedIn()
  );
  useEffect(() => {
    setMounted(true);
    setIsWalletConnected(mounted && userSession.isUserSignedIn());
  }, [mounted]);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const network = useCurrentNetwork();

  const authenticate = useCallback(() => {
    setIsWalletOpen(true);
    showConnect({
      appDetails: {
        name: 'Hiro Smart Wallet',
        icon: `${window.location.origin}/logo512.png`,
      },
      redirectTo: '/',
      onFinish: () => {
        setIsWalletOpen(false);
        setIsWalletConnected(userSession.isUserSignedIn());
      },
      onCancel: () => {
        setIsWalletOpen(false);
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut(window.location?.toString());
  }, []);

  const testnetAddress = isWalletConnected
    ? userSession.loadUserData().profile.stxAddress.testnet
    : null;
  const mainnetAddress = isWalletConnected
    ? userSession.loadUserData().profile.stxAddress.mainnet
    : null;
  // TODO: stacksjs needs to add support for devnet addresses
  const devnetAddress = isWalletConnected
    ? userSession.loadUserData().profile.stxAddress.devnet ||
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    : null;

  const currentAddress = network.id === 'testnet' ? testnetAddress : network.id === 'mainnet' ? mainnetAddress : devnetAddress;

  return (
    <HiroWalletContext.Provider
      value={{
        authenticate,
        disconnect,
        isWalletOpen,
        isWalletConnected,
        testnetAddress,
        mainnetAddress,
        devnetAddress,
        currentAddress,
      }}
    >
      {children}
    </HiroWalletContext.Provider>
  );
};
