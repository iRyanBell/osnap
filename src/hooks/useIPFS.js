import { useState, useEffect } from "react";
import IPFS from "ipfs";

export default function useIPFS() {
  const [peerID, setPeerID] = useState(null);

  useEffect(() => {
    if (!window.ipfs) {
      /* Insantiate an IPFS node and wait for Ready() signal. */
      IPFS.create()
        .then(async (node) => {
          /* Inject the full IPFS node object to the global window namespace. */
          window.ipfs = node;
          setPeerID((await node.id()).id);
        })
        .catch((err) => {
          console.error(err);
          setPeerID(-1); // Error: Unable to connect to IPFS.
        });
    } else {
      /* Retrieve identity from an existing IPFS node. */
      window.ipfs
        .id()
        .then((identity) => setPeerID(identity.id))
        .catch((err) => {
          console.error(err);
          setPeerID(-1); // Error: Unable to connect to IPFS.
        });
    }
  }, []);

  return peerID;
}
