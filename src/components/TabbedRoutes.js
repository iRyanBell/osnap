import React from "react";
import { Switch, Route } from "react-router-dom";
import { Logo, NavMenu, NavTabs, NavIpfsGatewaySwitch } from "../components";
import routes from "../app/routes";

export default function TabbedRoutes({
  location,
  isLocalIPFSGateway,
  onToggleIPFSGateway,
}) {
  return (
    <>
      <NavMenu
        childrenLeft={[<Logo />, <NavTabs location={location} />]}
        childrenRight={
          <NavIpfsGatewaySwitch
            isLocalIPFSGateway={isLocalIPFSGateway}
            onToggleIPFSGateway={onToggleIPFSGateway}
          />
        }
      />

      {/* Main content from dynamic ./pages routing. */}
      <Switch>
        {routes
          .slice(0)
          .reverse()
          .map(({ path, component }) => (
            <Route key={path} path={path} component={component} />
          ))}
      </Switch>
    </>
  );
}
