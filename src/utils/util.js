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
