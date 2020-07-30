import React from "react";
import { ReactComponent as LogoSvg } from "../assets/svg/logo.svg";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  logo: {
    "& .logoBar1, & .logoBar2": {
      fill: theme.palette.primary.main,
    },
    width: 100,
    fill: theme.palette.common.white,
  },
}));

export default function Logo({ className }) {
  const classes = useStyles();
  return <LogoSvg className={[classes.logo, className].join(" ")} />;
}
