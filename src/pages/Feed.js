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

  /* State: Paginated post listing */
  const [totalPosts, setTotalPosts] = useState(0);
  const [postOffset, setPostOffset] = useState(0);
  const [posts, setPosts] = useState([]);

  /* Hook into Web3 & IPFS Configuration States. */
  const peerID = useIPFS();
  const ethAddr = useContext(Web3Context);
  const isLocalIPFSGateway = useContext(IpfsGatewayContext);

  /* Define an IPFS Gateway base URL by preference.  */
  const gatewayBaseURL = ipfsGatewayBaseURL({ isLocalIPFSGateway });

  /* Define a post listing view relative to root or address path. */
  const isUserView = window.location.hash.startsWith("#/0x");

  useEffect(() => {
    const getPosts = async () => {
      const oSnapContract = new window.web3.eth.Contract(abi, contractAddress);

      /* Define user post listing address by URL. */
      const userAddr = window.location.hash.slice(2);

      try {
        /* Define the total posts from the smart contract relative to the listing. */
        const nbTotalPosts = Number(
          isUserView
            ? await oSnapContract.methods
                .getTotalPostsByAddress(userAddr)
                .call()
            : await oSnapContract.methods.getPostID().call()
        );
        setTotalPosts(nbTotalPosts);

        /* Define the total posts to display on the current page. */
        const nbPostsOnPage = Math.min(postsPerPage, nbTotalPosts - postOffset);

        setPosts(
          await Promise.all(
            /* Map each item to a { multihash, postID, op } object */
            [...Array(nbPostsOnPage).keys()].map(async (postIdx) => {
              /* Define the postID relative to the paginated item offset */
              const postOffsetIdx = postOffset + postIdx;

              /* Define postID by reverse-sorted idx */
              const postID = isUserView
                ? await oSnapContract.methods
                    .getPostIDByAddressIdx(
                      userAddr,
                      nbTotalPosts - postOffsetIdx - 1
                    )
                    .call()
                : nbTotalPosts - postOffsetIdx - 1;

              /* Define the original poster */
              const op = await oSnapContract.methods.getOPByID(postID).call();

              /* Define the IPFS multihash */
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
  }, [ethAddr, postOffset, isUserView]);

  const handleChangePage = (e, page) => {
    /* Update item offset */
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
