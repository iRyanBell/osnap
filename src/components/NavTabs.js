import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

import routes from "../app/routes";

const useStyles = makeStyles(() => ({
  indicator: {
    top: 0,
    bottom: "auto",
  },
  tab: {
    minWidth: 80,
  },
}));

export default function NavTabs({ location }) {
  const classes = useStyles();

  return (
    <Tabs classes={{ indicator: classes.indicator }} value={location.pathname}>
      {routes.map(({ label, path }) => (
        <Tab
          key={label}
          label={label}
          value={path}
          component={Link}
          to={path}
          className={classes.tab}
        />
      ))}
    </Tabs>
  );
}
