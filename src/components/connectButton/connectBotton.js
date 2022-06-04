import React from "react";
import Button from '@mui/material/Button';
import { onConnect } from "../../utils/wallet";
import { formatWalletAddress } from "../../utils/util";

import styles from "./connectBotton.module.css";

export const ConnectButton = ({ data }) => {
    return (
        <div className={styles.buttonWrapper}>
            {data.state.address ? (
                <span>Connected: {formatWalletAddress(data.state.address)}</span>
            ) : (
                <Button variant="contained"
                    onClick={() => onConnect(data)}
                >
                    Connect
                </Button>
            )}
        </div>
    )
}