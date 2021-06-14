import { useTranslation } from "react-i18next";

// Material UI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

interface Props {
  id: number
  message: string
  open: boolean
  handleClose(): void
  handleDelete(): void
}

const ConfirmDialog = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText data-testid={`${props.id}-confirm-text`}>
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleDelete} color="primary" data-testid={`${props.id}-ok`}>
          {t("__general.ok")}
        </Button>
        <Button onClick={props.handleClose} color="primary" data-testid={`${props.id}-cancel`} autoFocus>
          {t("__general.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;