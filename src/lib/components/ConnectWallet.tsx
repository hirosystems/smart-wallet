import React, { useEffect, useState } from "react";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import { Button } from "@chakra-ui/react";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });

function authenticate() {
  showConnect({
    appDetails: {
      name: "Smart Wallet",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

const ConnectWallet = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (mounted && userSession.isUserSignedIn()) {
    return (
      <div>
        <Button className="Connect" onClick={disconnect}>
          Disconnect  { userSession.loadUserData().profile.stxAddress.testnet }
        </Button>
      </div>
    );
  }

  return (
    <Button className="Connect" onClick={authenticate}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;