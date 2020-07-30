import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";

export default createMuiTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: red[700],
    },
    type: "dark",
    background: {
      default: grey[900],
    },
  },
  typography: {
    /* Default to system fonts. Fallback to Roboto typeface. */
    fontFamily: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto"],
  },
});
