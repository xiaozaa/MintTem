import { abi } from "./abi";
import {
  GAS_INCREASE,
} from "./const";
import {
  CONTRACTADDRESS,
  PRICE,
} from "./configuration";
import { getMintStatus } from "./status";

import { transactionHostURL } from "./util";

const formatMintTransaction = async (data) => {
  const web3 = data.state.web3;
  const address = data.state.address;
  const chainId = data.state.chainId;
  const count = data.state.count;
  const targetContract = CONTRACTADDRESS[chainId];
  var contract = new web3.eth.Contract(abi, targetContract);

  let extraData;
  var mintType = await getMintStatus(data);
  if (!mintType) {
    mintType = data.state.mintType;
  }
  if (mintType === "public") {
    extraData = await contract.methods.mint(count);
  } else {
    throw new Error("Sales is not start yet.");
  }
  let input = extraData.encodeABI();
  const finalPrice = count * PRICE;
  const estimatedGas = await web3.eth.estimateGas({
    from: address,
    data: input,
    to: targetContract,
    value: web3.utils.toWei(finalPrice.toString(), "ether"),
  });
  const nonce = await web3.eth.getTransactionCount(address, "latest");
  return {
    gas: parseInt(estimatedGas * GAS_INCREASE),
    to: targetContract,
    from: address,
    value: web3.utils.toWei(finalPrice.toString(), "ether"),
    data: web3.utils.toHex(input),
    nonce,
  };
};

export const MintTransaction = async (data) => {
  if (!data.state.web3) {
    return;
  }

  if (data.state.mintErrorMsg) {
    data.setState({
      mintErrorMsg: "",
    });
  }

  try {
    const tx = await formatMintTransaction(data);
    function sendTransaction(_tx) {
      return new Promise((resolve, reject) => {
        data.state.web3.eth
          .sendTransaction(_tx)
          .once("transactionHash", (txHash) => resolve(txHash))
          .catch((err) => reject(err));
      });
    }
    const result = await sendTransaction(tx);
    data.setState({
      txn: result,
      pendingRequest: true,
      modalDialogBodyHref: `${transactionHostURL(
        data.state.chainId
      )}/${result}`,
      modalDialogBodyText:
        "You have approved the transaction, please don't close the dialog until your transaction completes successfully.",
    });
    const interval = setInterval(function () {
      data.state.web3.eth.getTransactionReceipt(result, function (err, rec) {
        if (rec) {
          clearInterval(interval);
          data.setState({
            finish: true,
            pendingRequest: false,
            modalDialogBodyHref: `${transactionHostURL(
              data.state.chainId
            )}/${result}`,
            modalDialogBodyText: `Successfully minted NFT!`,
          });
        }
      });
    }, 1000);
  } catch (error) {
    console.error("CATCHERROR", error.message);
    var myRe = /{.*}/g;
    var str = error.message.replace(/(\r\n|\n|\r)/gm, "");
    var errArray = myRe.exec(str);
    if (errArray && errArray.length > 0) {
      if (JSON.parse(errArray[0]).originalError.message) {
        const errorDetails = JSON.parse(errArray[0]).originalError.message;
        data.setState({
          mintErrorMsg: errorDetails,
        });
      } else {
        data.setState({
          mintErrorMsg: error.message,
        });
      }
    } else {
      data.setState({
        mintErrorMsg: error.message,
      });
    }
  }
};

