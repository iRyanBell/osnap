const { assert } = require("chai");
const OSnap = artifacts.require("Osnap");

contract("OSnap", (accounts) => {
  const test_bytes32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const [k0, k1, k2] = accounts;
  let osnap;

  it("should initialize", async () => {
    osnap = await OSnap.deployed();
    console.log("OSnap Address:", osnap.address);
  });

  it("should revert if the post id is not found.", async () => {
    try {
      await osnap.getPostById(1);
    } catch (err) {
      // Call was reverted.
      return true;
    }
  });

  it("should revert if the post address is not found.", async () => {
    try {
      await osnap.getPostByAddressIdx(0x0, 0);
    } catch (err) {
      // Call was reverted.
      return true;
    }
  });

  it("should revert if the post address idx is not found.", async () => {
    try {
      await osnap.getPostByAddressIdx(k0, 0);
    } catch (err) {
      // Call was reverted.
      return true;
    }
  });

  it("should revert if no tips are provided", async () => {
    try {
      await osnap.addPost(0, 0, 0, 0, web3.utils.fromUtf8("0"), 0, 0, {
        from: k2,
        value: web3.utils.toWei("0.0", "ether").toString(),
      });
    } catch (err) {
      // Call was reverted.
      return true;
    }
  });

  it("should revert if the tips have an invalid sum", async () => {
    try {
      await osnap.addPost(
        0,
        web3.utils.toWei("0.01", "ether"),
        0,
        web3.utils.toWei("0.02", "ether"),
        test_bytes32,
        0,
        0,
        {
          from: k2,
          value: web3.utils.toWei("0.01", "ether").toString(),
        }
      );
    } catch (err) {
      // Call was reverted.
      return true;
    }
  });

  it("should add a post if the tips are valid", async () => {
    const postTx = await osnap.addPost(
      0,
      web3.utils.toWei("0.01", "ether"),
      0,
      web3.utils.toWei("0.02", "ether"),
      test_bytes32,
      0,
      0,
      {
        from: k0,
        value: web3.utils.toWei("0.03", "ether").toString(),
      }
    );
    const postID = postTx.logs[0].args.postID.toNumber();
    assert(postID == 0, "Invalid postID returned.");
  });

  it("should increment the postID", async () => {
    const postTx = await osnap.addPost(
      0,
      web3.utils.toWei("0.01", "ether"),
      0,
      web3.utils.toWei("0.01", "ether"),
      test_bytes32,
      0,
      0,
      {
        from: k0,
        value: web3.utils.toWei("0.02", "ether").toString(),
      }
    );
    const postID = postTx.logs[0].args.postID.toNumber();
    assert(postID == 1, "Invalid postID returned.");
  });

  it("should return a post multihash", async () => {
    const post = await osnap.getPostById(0);

    const digest = post.digest;
    const hashFn = post.hashFunction.toNumber();
    const size = post.size.toNumber();

    assert(digest == test_bytes32, "Invalid Multihash: Digest");
    assert(hashFn == 0, "Invalid Multihash: Hash Function");
    assert(size == 0, "Invalid Multihash: Size");
  });

  it("should return a poster address by postID", async () => {
    const op = await osnap.getOPByID(0);

    assert(op === k0, "Invalid original poster address");
  });

  it("should return the total posts by address", async () => {
    const nbPosts = (await osnap.getTotalPostsByAddress(k0)).toNumber();
    assert(nbPosts === 2, "Invalid number of posts.");
  });

  it("should return a multihash by address idx", async () => {
    const post = await osnap.getPostByAddressIdx(k0, 0);

    const digest = post.digest;
    const hashFn = post.hashFunction.toNumber();
    const size = post.size.toNumber();

    assert(digest == test_bytes32, "Invalid Multihash: Digest");
    assert(hashFn == 0, "Invalid Multihash: Hash Function");
    assert(size == 0, "Invalid Multihash: Size");
  });

  it("should add a tip", async () => {
    await osnap.addTip(0, {
      from: k2,
      value: web3.utils.toWei("0.123", "ether").toString(),
    });
  });
});
