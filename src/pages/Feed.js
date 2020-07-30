import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Container, Box } from "@material-ui/core";
import { Grid, Card } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { useIPFS } from "../hooks";
import { getMultihashFromBytes32, ipfsGatewayBaseURL } from "../utils/ipfs";
import { ConnectivityErrors } from "../components";
import Web3Context from "../context/web3Context";
import IpfsGatewayContext from "../context/ipfsGatewayContext";
import { abi, contractAddress } from "../abi/osnap.json";

const postsPerPage = 15;

const useStyles = makeStyles((theme) => ({
  pagination: {
    marginTop: theme.spacing(2),
  },
}));

export default function Feed() {
  const classes = useStyles();
  const peerID = useIPFS();
  const ethAddr = useContext(Web3Context);
  const isLocalIPFSGateway = useContext(IpfsGatewayContext);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postOffset, setPostOffset] = useState(0);
  const [posts, setPosts] = useState([]);

  const gatewayBaseURL = ipfsGatewayBaseURL({ isLocalIPFSGateway });

  useEffect(() => {
    const isUserView = window.location.hash.startsWith("#/0x");
    const userAddr = window.location.hash.slice(2);

    const getPosts = async () => {
      const oSnapContract = new window.web3.eth.Contract(abi, contractAddress);

      try {
        const nbTotalPosts = Number(
          isUserView
            ? await oSnapContract.methods
                .getTotalPostsByAddress(userAddr)
                .call()
            : await oSnapContract.methods.getPostID().call()
        );
        setTotalPosts(nbTotalPosts);

        const nbPostsOnPage = Math.min(postsPerPage, nbTotalPosts - postOffset);

        setPosts(
          await Promise.all(
            [...Array(nbPostsOnPage).keys()].map(async (postIdx) => {
              const postOffsetIdx = postOffset + postIdx;
              const postID = isUserView
                ? await oSnapContract.methods
                    .getPostIDByAddressIdx(userAddr, postOffsetIdx)
                    .call()
                : postOffsetIdx;

              const op = await oSnapContract.methods.getOPByID(postID).call();

              const {
                digest,
                hashFunction,
                size,
              } = await oSnapContract.methods.getPostById(postID).call();

              const multihash = getMultihashFromBytes32({
                digest,
                hashFunction,
                size,
              });

              return { multihash, postID, op };
            })
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (ethAddr && ethAddr !== -1) {
      getPosts();
    }
  }, [ethAddr, postOffset]);

  const handleChangePage = (e, page) => {
    setPostOffset((page - 1) * postsPerPage);
  };

  return (
    <Container maxWidth="lg">
      <ConnectivityErrors ethAddr={ethAddr} peerID={peerID} />
      <Grid container spacing={3}>
        {posts.map(({ multihash, postID, op }) => {
          const postURL = [gatewayBaseURL, multihash].join("/");

          return (
            <Grid item xs={4} key={multihash}>
              <Card className={classes.card}>
                <a href={postURL} target="_blank" rel="noopener noreferrer">
                  <img src={postURL} width="100%" alt="oSnap.app Media" />
                </a>
                <Box padding={1}>
                  <Box flexGrow={1}>#{postID}</Box>
                  <Box>
                    <Link style={{ color: "#fff" }} to={op}>
                      {op}
                    </Link>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Pagination
        className={classes.pagination}
        count={Math.ceil(totalPosts / postsPerPage)}
        onChange={handleChangePage}
      />
    </Container>
  );
}
