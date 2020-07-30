import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Container } from "@material-ui/core";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { useIPFS } from "../hooks";
import { IpfsGatewayContext, Web3Context } from "../context";
import { ipfsGatewayBaseURL } from "../utils/ipfs";

const useStyles = makeStyles({
  tableHeader: {
    fontWeight: "bold",
  },
});

export default function Status() {
  const peerID = useIPFS();
  const classes = useStyles();
  const ethAddr = useContext(Web3Context);
  const isLocalIPFSGateway = useContext(IpfsGatewayContext);

  const gatewayBaseURL = ipfsGatewayBaseURL({ isLocalIPFSGateway });

  const rows = [
    { name: "IPFS: Peer ID", value: peerID || "..." },
    { name: "IPFS: Gateway", value: gatewayBaseURL },
    { name: "Ethereum: Wallet Address", value: ethAddr || "..." },
  ];

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell
                  className={classes.tableHeader}
                  component="th"
                  scope="row"
                >
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
