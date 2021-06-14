import { useMutation } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Material UI
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// API
import { CommentRequest } from "../api/models/requests/CommentRequest";
import { CommentCreateRequest } from "../api/models/requests/commentCreateRequest";
import { CommentUpdateRequest } from "../api/models/requests/commentUpdateRequest";
import { createComment, updateComment } from "../api";

interface Props {
  comment?: CommentRequest
  open: boolean
  action: "Create" | "Update"
  postId?: number
  handleClose(): void
  refetch(fetch: boolean): void
}

const CommentCreateOrUpdate = (props: Props) => {
  const { control, handleSubmit, reset } = useForm();
  const { t } = useTranslation();
  const { action, comment, postId } = props;

  const defaultVaues = {
    id: 0,
    name: "",
    text: ""
  }
  const commentRequest = comment || defaultVaues
  const commentPostId = postId || defaultVaues.id;

  const mutation = useMutation((data: CommentCreateRequest | CommentUpdateRequest) => {
    return action === "Create" ? createComment({ ...data as CommentCreateRequest, postId: commentPostId }) : updateComment(commentRequest.id, data);
  }, {
    onSuccess: () => {
      props.refetch(true);
      if (action === "Create") {
        reset(defaultVaues);
      }
      props.handleClose();
    }
  })

  const handleOnSubmit = (data: CommentCreateRequest | CommentUpdateRequest) => mutation.mutate(data);

  const title = action === "Create" ? t("__comment.createCommentTitle") : t("__comment.updateCommentTitle")

  return (
    <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" data-testid={`${commentRequest.id}-dialog-title`}>{title}</DialogTitle>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <DialogContent>
          <Controller
            name={"name"}
            control={control}
            defaultValue={commentRequest.name}
            render={({ field }) =>
              <TextField
                {...field}
                type="input"
                fullWidth
                label={"Name"}
                margin="dense"
                id="name"
                inputProps={{
                  "data-testid": `${commentRequest.id}-name-input`,
                }}
              />}
          />
          <Controller
            name={"text"}
            control={control}
            defaultValue={commentRequest.text}
            render={({ field }) =>
              <TextField
                {...field}
                type="input"
                fullWidth
                multiline={true}
                rows={10}
                label={"Comment text"}
                margin="dense"
                id="text"
                inputProps={{
                  "data-testid": `${commentRequest.id}-text-input-area`,
                }}
                required
              />}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" data-testid={`${commentRequest.id}-ok`}>
            {t("__general.ok")}
          </Button>
          <Button onClick={props.handleClose} color="primary" data-testid={`${commentRequest.id}-cancel`}>
            {t("__general.cancel")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CommentCreateOrUpdate;