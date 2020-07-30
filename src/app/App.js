import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { Route, HashRouter } from "react-router-dom";
import { TabbedRoutes } from "../components";

import theme from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Route
          path="/"
          render={(props) => (
            <TabbedRoutes
              isLocalIPFSGateway={false}
              onToggleIPFSGateway={() => {}}
              {...props}
            />
          )}
        />
      </HashRouter>
    </ThemeProvider>
  );
}
