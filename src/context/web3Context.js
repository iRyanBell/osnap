import { createContext } from "react";

const Web3Context = createContext();

export const { Provider: Web3Provider, Consumer: Web3Consumer } = Web3Context;

export default Web3Context;
