import bs58 from "bs58";

export const ipfsGatewayBaseURL = ({ isLocalIPFSGateway }) =>
  isLocalIPFSGateway ? "http://127.0.0.1:8080/ipfs" : "https://ipfs.io/ipfs";

export function getBytes32FromMultiash(multihash) {
  const decoded = bs58.decode(multihash);

  return {
    digest: `0x${decoded.slice(2).toString("hex")}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
}

export function getMultihashFromBytes32({ digest, hashFunction, size }) {
  if (size === 0) return null;

  const hashBytes = Buffer.from(digest.slice(2), "hex");

  const multihashBytes = new hashBytes.constructor(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);

  return bs58.encode(multihashBytes);
}
