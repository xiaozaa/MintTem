import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { formatTxn } from "../../utils/util";

export const ModalDialog = (props) => {
  const { onHide } = props;
  const handleClose = () => {
    onHide();
  };
  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={props.show}
      >
        <DialogTitle>Claiming NFT</DialogTitle>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography >
              {props.showPendingIcons && (
                <CircularProgress />
              )}
              <p>{props.bodyText}</p>
              {props.bodyHref ? (
                <span>
                  Txn Details:{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={props.bodyHref}
                  >
                    {formatTxn(props.bodyTxn)}
                  </a>
                </span>
              ) : (
                ""
              )}
            </Typography>
          </CardContent>
        </Card>
      </Dialog>
    </div>
  );
};
