import { whitelistAddresses } from "./configuration";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

export const formatWalletAddress = (address) => {
  return address && `${address.substring(0, 4)}...${address.substring(40)}`;
};

export const formatTxn = (txn) => {
  return txn && `${txn.substring(0, 4)}...${txn.substring(62)}`;
};

export const transactionHostURL = (chainId) => {
  let host = "https://etherscan.io/tx";
  switch (chainId) {
    case 4:
      host = "https://rinkeby.etherscan.io/tx";
      break;
    case 5:
      host = "https://goerli.etherscan.io/tx";
      break;
    default:
      break;

  }
  return host;
};

export const getProof = async (data) => {

  const leafNodes = whitelistAddresses.map(address => keccak256(address));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  const leaf = keccak256(data.state.address);
  const proof = merkleTree.getHexProof(leaf);
  console.log("PROOF", proof);
  return proof;
}