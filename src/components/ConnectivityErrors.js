import React from "react";
import { Alert } from "@material-ui/lab";

export default function ConnectivityErrors({ peerID, ethAddr }) {
  return (
    <>
      {peerID === null && <Alert severity="info">Connecting to IPFS...</Alert>}
      {ethAddr === null && (
        <Alert severity="info">Connecting to Web3 provider...</Alert>
      )}
      {ethAddr === -1 && (
        <Alert severity="error">
          Web3 provider not found. Visit{" "}
          <a
            href="https://metamask.io"
            rel="noopener noreferrer"
            target="_blank"
            style={{ color: "#fff" }}
          >
            metamask.io
          </a>
          .
        </Alert>
      )}
      {ethAddr === false && (
        <Alert severity="warning">Unable to authenticate Web3 provider.</Alert>
      )}
    </>
  );
}
