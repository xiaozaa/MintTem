import Web3 from "web3";
import { getMintStatus, getMintedRecur } from "./status";

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */

export const onConnect = async (data) => {

  const provider = await data.web3Modal.connect();

  await subscribeProvider(provider, data);

  await provider.enable();

  const web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();

  const address = accounts[0];

  const networkId = await web3.eth.net.getId();

  const chainId = await web3.eth.getChainId();

  await data.setState({
    web3,
    provider,
    connected: true,
    address,
    chainId,
    networkId,
    count: 1,
    mintTransaction: "",
    pendingRequest: false,
    txn: "",
    finish: false,
    mintableNum: -1,
    tier: 0,
    modalDialogTitle: "",
    modalDialogBodyText: "",
    containedModalShow: "",
    mintErrorMsg: "",
  });
  var mintType = await getMintStatus(data);
  if (mintType) {
    data.setState({
      mintType: mintType,
    });
  }
  getMintedRecur(data);
};

const subscribeProvider = async (provider, data) => {
  if (!provider.on) {
    return;
  }
  provider.on("close", () => data.state.resetApp());
  provider.on("accountsChanged", async (accounts) => {
    await data.setState({
      address: accounts[0],
      mintableNum: -1,
      tier: 0
    });
  });
  provider.on("chainChanged", async (chainId) => {
    const { web3 } = data.state;
    const networkId = await web3.eth.net.getId();
    await data.setState({
      chainId, networkId,
      mintType: ""
    });
  });

  provider.on("networkChanged", async (networkId) => {
    const { web3 } = data.state;
    const chainId = await web3.eth.chainId();
    await data.setState({
      chainId, networkId,
      mintType: ""
    });
  });
};

