import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
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
import theme from "../app/theme";

const useStyles = makeStyles({
  tableHeader: {
    fontWeight: "bold",
  },
  trColumn: {
    /* Single column view. */
    "& th, & td": {
      width: "100%",
      textAlign: "left",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

export default function Status() {
  const classes = useStyles();

  /* Hook into Web3 & IPFS Configuration States. */
  const peerID = useIPFS();
  const ethAddr = useContext(Web3Context);
  const isLocalIPFSGateway = useContext(IpfsGatewayContext);

  /* Responsive flexbox table collapses to 1-column on small screens. */
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  /* Define an IPFS Gateway base URL by preference.  */
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
              <TableRow
                className={isSm ? classes.trColumn : null}
                key={row.name}
              >
                {/* Row: Name */}
                <TableCell
                  className={classes.tableHeader}
                  component="th"
                  scope="row"
                >
                  {row.name}
                </TableCell>

                {/* Row: Value */}
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
