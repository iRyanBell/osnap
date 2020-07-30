import React, { useContext, useRef, useState } from "react";
import { Container, Paper, Box } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import { useIPFS } from "../hooks";
import { ConnectivityErrors } from "../components";
import { getBytes32FromMultiash, ipfsGatewayBaseURL } from "../utils/ipfs";
import { IpfsGatewayContext, Web3Context } from "../context";
import { abi, contractAddress } from "../abi/osnap.json";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 720,
    margin: "0 auto",
    padding: theme.spacing(4),
  },
  success: {
    marginTop: theme.spacing(2),
  },
}));

export default function Post() {
  const classes = useStyles();
  const [fileMultihash, setFileMultihash] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recipientA, setRecipientA] = useState(0);
  const [tipA, setTipA] = useState("0");
  const [recipientB, setRecipientB] = useState(0);
  const [tipB, setTipB] = useState("0");
  const isLocalIPFSGateway = useContext(IpfsGatewayContext);

  const gatewayBaseURL = ipfsGatewayBaseURL({ isLocalIPFSGateway });

  const peerID = useIPFS();
  const ethAddr = useContext(Web3Context);

  const fileUploadRef = useRef();
  const handleUpload = () => {
    fileUploadRef.current.click();
  };

  const handlePost = async () => {
    const { digest, hashFunction, size } = getBytes32FromMultiash(
      fileMultihash
    );

    const oSnapContract = new window.web3.eth.Contract(abi, contractAddress);

    const [k0] = await window.web3.eth.getAccounts();
    const totalTipAmount = window.web3.utils
      .toBN(window.web3.utils.toWei(tipA))
      .add(window.web3.utils.toBN(window.web3.utils.toWei(tipB)))
      .toString();

    oSnapContract.methods
      .addPost(
        Number(recipientA),
        window.web3.utils.toWei(tipA),
        Number(recipientB),
        window.web3.utils.toWei(tipB),
        digest,
        hashFunction,
        size
      )
      .send({
        from: k0,
        value: totalTipAmount.toString(),
      })
      .on("confirmation", () => {
        setIsSuccess(true);
      });
  };

  const handleFileUploader = async (e) => {
    const [file] = e.target.files;

    try {
      const { path: multihash } = await window.ipfs.add(file);
      setFileMultihash(multihash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg">
      <ConnectivityErrors peerID={peerID} ethAddr={ethAddr} />
      <Box width={720} margin="0 auto">
        <Typography variant="h5" component="div">
          Step 1/2: File Upload
        </Typography>
      </Box>
      <Paper className={classes.paper}>
        <input
          ref={fileUploadRef}
          type="file"
          style={{ display: "none" }}
          accept="image/png, image/jpeg, image/gif"
          /* TODO: video/mp4, audio/mp4, audio/mpeg, audio/ogg, text/plain */
          onChange={handleFileUploader}
        />
        <Box display="flex" alignItems="center">
          <Button
            disabled={!window.ipfs}
            variant="contained"
            onClick={handleUpload}
          >
            Upload Image
          </Button>
          <Box marginLeft={1}>
            {fileMultihash ? (
              <a
                href={[gatewayBaseURL, fileMultihash].join("/")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff" }}
              >
                {fileMultihash}
              </a>
            ) : (
              <Typography variant="body2" component="span">
                Select an image (.jpg, .png, .gif)
              </Typography>
            )}
          </Box>
        </Box>
        {fileMultihash && (
          <Alert className={classes.success} color="success">
            Successfully uploaded image to IPFS!
          </Alert>
        )}
      </Paper>
      {fileMultihash && (
        <>
          <Box marginTop={4} width={720} margin="0 auto">
            <Typography variant="h5" component="div">
              Step 2/2: Media Tangle Tips
            </Typography>
          </Box>
          <Paper className={classes.paper}>
            <Box>
              <TextField
                autoFocus
                fullWidth
                label="Post ID"
                value={recipientA}
                onChange={(e) => setRecipientA(e.target.value)}
              />
              <TextField
                fullWidth
                label="Tip Amount (Eth)"
                placeholder="0.0"
                value={tipA}
                onChange={(e) => setTipA(e.target.value)}
              />
            </Box>
            <Box marginTop={4}>
              <TextField
                fullWidth
                label="Post ID"
                value={recipientB}
                onChange={(e) => setRecipientB(e.target.value)}
              />
              <TextField
                fullWidth
                label="Tip Amount (Eth)"
                placeholder="0.0"
                value={tipB}
                onChange={(e) => setTipB(e.target.value)}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" marginTop={4}>
              <Button
                variant="contained"
                onClick={handlePost}
                disabled={tipA === "0" || tipB === "0"}
              >
                Post
              </Button>
            </Box>
            {isSuccess && (
              <Alert className={classes.success} color="success">
                Successfully posted to oSnap!
              </Alert>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
}
