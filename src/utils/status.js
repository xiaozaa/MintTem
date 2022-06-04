import { abi } from "./abi";
import {
    MINTED_CHECK_CAP,
} from "./const";
import {
    CONTRACTADDRESS,
} from "./configuration";

var interId;

export const getMintedRecur = async (data) => {
    try {
        var mintType = await getMintStatus(data);
        if (mintType) {
            getMinted(data);
        }
        if (interId) {
            clearInterval(interId);
        } else {
            interId = setInterval(async function () {
                var mintType = await getMintStatus(data);
                if (mintType) {
                    getMinted(data);
                    data.setState({
                        mintType
                    })
                }
            }, MINTED_CHECK_CAP);
        }
    } catch (err) {
        console.error(err.message);
    }
};

export const getMintStatus = async (data) => {
    if (!data.state.web3) {
        throw new Error("Error: Please connect correct wallet.");
    } else {
        const web3 = data.state.web3;
        const chainId = Number(data.state.chainId);
        const targetContract = CONTRACTADDRESS[chainId];
        var contract = new web3.eth.Contract(abi, targetContract);

        var isPublic = false;
        try {
            isPublic = await contract.methods.isPublicSaleOn().call((err, result) => {
                if (err) {
                    return false;
                }
                return result;
            });
        } catch (err) {
            isPublic = false;
        }
        if (isPublic) {
            return "public";
        } else {
            return "";
        }
    }
};

export const getMinted = async (data) => {
    if (!data.state.web3) {
        throw new Error("Error: Please connect correct wallet.");
    } else {
        const web3 = data.state.web3;
        const chainId = data.state.chainId;
        const targetContract = CONTRACTADDRESS[chainId];
        var contract = new web3.eth.Contract(abi, targetContract);
        contract.methods.totalSupply().call((err, result) => {
            if (err) {
                console.error("Error: ", err);
            }
            data.setState({
                mintedNum: result,
            });
        });
    }
};
