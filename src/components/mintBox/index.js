import React, { useEffect } from "react";

import { onConnect } from "../../utils/wallet";
import { ConnectButton } from "../connectButton/connectBotton";
import { MintBox } from "./box";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import { ModalDialog } from "../shared-components/component";

import styles from "./index.module.css";

const providerOptions = {
  walletlink: {
    package: WalletLink, // Required
    options: {
      appName: "My Awesome App", // Required
      infuraId: "INFURA_ID", // Required unless you provide a JSON RPC url; see `rpc` below
      rpc: "", // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      appLogoUrl: null, // Optional. Application logo image URL. favicon is used if unspecified
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
  walletconnect: {
    display: {
      name: "Mobile",
    },
    package: WalletConnectProvider,
    options: {
      infuraId: "INFURA_ID", // required
    },
  },
};

export const Home = ({ data }) => {
  data.web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: providerOptions,
  });

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"))
        await onConnect(data);
    })();
  }, [data]);

  return (
    <div className={styles.homeWrapper}>
      <ConnectButton data={data} />
      <MintBox data={data} />
      {data.state.containedModalShow && (
        <ModalDialog
          title={data.state.modalDialogTitle}
          bodyText={
            data.state.mintErrorMsg
              ? data.state.mintErrorMsg
              : data.state.modalDialogBodyText
          }
          bodyHref={data.state.modalDialogBodyHref}
          bodyTxn={data.state.txn}
          show={data.state.containedModalShow}
          showPendingIcons={data.state.pendingRequest}
          onHide={() => {
            data.setState({
              containedModalShow: false,
              modalDialogTitle: "",
              modalDialogBodyText: "",
              pendingRequest: false,
              mintErrorMsg: "",
              modalDialogBodyHref: "",
            });
          }}
          state={data.state}
        />
      )}
    </div>
  );
};
