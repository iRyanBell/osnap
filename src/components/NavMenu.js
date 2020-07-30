import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    marginBottom: theme.spacing(2),
  },
}));

export default function NavMenu({ childrenLeft, childrenRight }) {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="static" elevation={0}>
      <Toolbar variant="dense">
        {/* Expanded left-aligned nav items. */}
        <Box display="flex" flexGrow={1}>
          {childrenLeft}
        </Box>
        {/* Right-aligned nav items. */}
        {childrenRight}
      </Toolbar>
    </AppBar>
  );
}
