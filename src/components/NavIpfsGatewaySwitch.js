import React from "react";
import { FormControlLabel, Switch } from "@material-ui/core";

export default function NavIpfsGatewaySwitch({
  isLocalIPFSGateway,
  onToggleIPFSGateway,
}) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={isLocalIPFSGateway}
          onChange={onToggleIPFSGateway}
          color="primary"
        />
      }
      label={isLocalIPFSGateway ? "Local" : "Gateway"}
    />
  );
}
