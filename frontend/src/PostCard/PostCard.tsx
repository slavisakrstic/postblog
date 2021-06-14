import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

// Material UI
import { Card, CardActions, CardContent, IconButton, Typography } from "@material-ui/core";
import PageviewIcon from "@material-ui/icons/Pageview";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

// Utils
import { truncateString } from "../utils/string";

// Custom components
import ConfirmDialog from "../ConfirmDialog";

// Hooks
import { usePostCardDeleteModal, usePostCardEditModal } from "./hooks/usePostCard";

// Routes
import { postDetailsPath } from "../constants/routes";

// Styles
import useStyles from "./styles";

// API
import { deletePost } from "../api";
import PostCreateOrUpdate from "../PostCreateOrUpdate";
import { PostResponse } from "../api/models/responses/PostResponse";

interface Props {
  post: PostResponse
  refetch(fetch: boolean): void
}

const PostCard = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const { openDelete, handleOpenDelete, handleCloseDelete } = usePostCardDeleteModal();
  const { openEdit, handleOpenEdit, handleCloseEdit } = usePostCardEditModal();

  const mutation = useMutation((id: number) => {
    return deletePost(id)
  }, {
    onSuccess: () => {
      props.refetch(true);
    }
  });

  const handleConfirmDelete = () => {
    mutation.mutate(props.post.id);
  }

  const handleView = (id: number): void => {
    history.push(postDetailsPath(id));
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="h5" component="h2" data-testid={`${props.post.id}-title`}>
          {props.post.title}
        </Typography>
        <Typography gutterBottom variant="caption" component="p">
          <i data-testid={`${props.post.id}-numberOfComments`}>{t("__post.numberOfComments")}: <b>{props.post.numberOfComments}</b></i>
        </Typography>
        <Typography variant="body2" color="textSecondary" component="pre" className={classes.preBox} data-testid={`${props.post.id}-blog`}>
          {truncateString(props.post.blog)}
        </Typography>
      </CardContent>
      <CardActions>
        <div onClick={() => handleView(props.post.id)} data-testid={`${props.post?.id}-view-action`}>
          <IconButton>
            <PageviewIcon color="primary" />
          </IconButton>
        </div>
        <div onClick={handleOpenEdit} data-testid={`${props.post?.id}-edit-action`}>
          <IconButton>
            <EditIcon color="primary" />
          </IconButton>
        </div>
        <div onClick={handleOpenDelete} data-testid={`${props.post?.id}-delete-action`}>
          <IconButton>
            <DeleteForeverIcon color="primary" />
          </IconButton>
        </div>
      </CardActions>
      <ConfirmDialog
        message={t("__post.deleteMsg")}
        open={openDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleConfirmDelete}
        id={props.post.id}
      />
      <PostCreateOrUpdate
        open={openEdit}
        handleClose={handleCloseEdit}
        post={props.post}
        action={"Update"}
        refetch={props.refetch}
      />
    </Card>
  );
}

export default PostCard;