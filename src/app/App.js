import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../app/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>oSnap.app</main>
    </ThemeProvider>
  );
}
