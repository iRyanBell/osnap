import { createContext } from "react";

const IpfsGatewayContext = createContext();

export const {
  Provider: IpfsGatewayProvider,
  Consumer: IpfsGatewayConsumer,
} = IpfsGatewayContext;

export default IpfsGatewayContext;
