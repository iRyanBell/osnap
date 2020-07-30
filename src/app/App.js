import React, { useState } from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { Route, HashRouter } from "react-router-dom";
import { TabbedRoutes } from "../components";

import theme from "./theme";

export default function App() {
  const [isLocalIPFSGateway, setIsLocalIPFSGateway] = useState(
    Boolean(Number(window.localStorage.getItem("localIPFSGateway")))
  );

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
