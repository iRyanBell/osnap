import React, { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { Route, HashRouter } from "react-router-dom";
import { TabbedRoutes } from "../components";
import Web3 from "web3";

import theme from "./theme";

export default function App() {
  const [ethAddr, setEthAddr] = useState(null);
  const [isLocalIPFSGateway, setIsLocalIPFSGateway] = useState(
    Boolean(Number(window.localStorage.getItem("localIPFSGateway")))
  );

  const connectToEthWallet = async () => {
    if (typeof window.web3 === "undefined") {
      setEthAddr(-1); // Error: Web3-enabled browser not detected.
      return;
    }

    try {
      /* Request permission for MetaMask (or similar) in-browser Ethereum wallet. */
      window.web3 = new Web3(window.web3.currentProvider);
      const k0 = await window.web3.currentProvider.enable();

      setEthAddr(k0);
    } catch (err) {
      console.error(err);
      setEthAddr(false); // Error: Unable to authenticate with Web3 Provider.
    }
  };

  useEffect(() => {
    connectToEthWallet();
  }, []);

  const handleToggleIPFSGateway = () => {
    window.localStorage.setItem(
      "localIPFSGateway",
      Number(!isLocalIPFSGateway)
    );
    setIsLocalIPFSGateway(!isLocalIPFSGateway);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Route
          path="/"
          render={(props) => (
            <TabbedRoutes
              isLocalIPFSGateway={isLocalIPFSGateway}
              onToggleIPFSGateway={handleToggleIPFSGateway}
              {...props}
            />
          )}
        />
      </HashRouter>
    </ThemeProvider>
  );
}
