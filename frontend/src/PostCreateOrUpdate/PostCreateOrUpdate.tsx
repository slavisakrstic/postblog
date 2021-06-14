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
import { createPost, updatePost } from "../api";
import { PostUpdateRequest } from "../api/models/requests/postUpdateRequest";
import { PostCreateRequest } from "../api/models/requests/postCreateRequest";
import { PostRequest } from "../api/models/requests/postRequest";

interface Props {
  post?: PostRequest
  open: boolean
  action: "Create" | "Update"
  handleClose(): void
  refetch(fetch: boolean): void
}

const PostCreateOrUpdate = (props: Props) => {
  const { control, handleSubmit, reset } = useForm();
  const { t } = useTranslation()
  const { action, post } = props;

  const defaultVaues = {
    id: 0,
    title: "",
    blog: ""
  }
  const postRequest = post || defaultVaues

  const mutation = useMutation((data: PostCreateRequest | PostUpdateRequest) => {
    return action === "Create" ? createPost(data as PostCreateRequest) : updatePost(postRequest.id, data);
  }, {
    onSuccess: () => {
      if (action === "Create") {
        reset(defaultVaues);
      }
      props.refetch(true);
      props.handleClose();
    }
  })

  const handleOnSubmit = (data: PostCreateRequest | PostUpdateRequest) => mutation.mutate(data);

  const title = action === "Create" ? t("__post.createPostTitle") : t("__post.updatePostTitle")

  return (
    <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" data-testid={`${postRequest.id}-dialog-title`}>{title}</DialogTitle>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <DialogContent>
          <Controller
            name={"title"}
            control={control}
            defaultValue={postRequest.title}
            data-testid={`${postRequest.id}-title`}
            render={({ field }) =>
              <TextField
                {...field}
                type="input"
                fullWidth
                label={"Title"}
                margin="dense"
                id="title"
                inputProps={{
                  "data-testid": `${postRequest.id}-title-input`,
                }}
                required
              />}
          />
          <Controller
            name={"blog"}
            control={control}
            defaultValue={postRequest.blog}
            data-testid={`${postRequest.id}-blog`}
            render={({ field }) =>
              <TextField
                {...field}
                type="input"
                fullWidth
                multiline={true}
                rows={10}
                label={"Post blog"}
                margin="dense"
                id="blog"
                inputProps={{
                  "data-testid": `${postRequest.id}-blog-input-area`,
                }}
              />}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary" data-testid={`${postRequest.id}-ok`}>
            {t("__general.ok")}
          </Button>
          <Button onClick={props.handleClose} color="primary" data-testid={`${postRequest.id}-cancel`}>
            {t("__general.cancel")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostCreateOrUpdate;