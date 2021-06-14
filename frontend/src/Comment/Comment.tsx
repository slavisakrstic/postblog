import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";

// Material UI
import { IconButton, Typography } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";

// API
import { CommentResponse } from "../api/models/responses/CommentResponse";
import { deleteComment } from "../api/comments";

// Custom component
import ConfirmDialog from "./../ConfirmDialog";

// Hooks
import { useCommentCardEditModal, useCommentDeleteModal } from "./hooks/useComment";

// Styles
import useStyles from "./styles";
import CommentCreateOrUpdate from "./../CommentCreateOrUpdate";

interface Props {
  comment: CommentResponse,
  refetch(fetch: boolean): void
}

const Comment = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { openDelete, handleOpenDelete, handleCloseDelete } = useCommentDeleteModal();
  const { openEdit, handleOpenEdit, handleCloseEdit } = useCommentCardEditModal();

  const mutation = useMutation((id: number) => {
    return deleteComment(id)
  }, {
    onSuccess: () => {
      props.refetch(true);
      handleCloseDelete();
    }
  });

  const handleConfirmDelete = () => {
    mutation.mutate(props.comment.id);
  }

  return (
    <div className={classes.content}>
      <Typography variant="caption" color="textSecondary" component="pre" className={classes.preBox}>
        <b data-testid={`${props.comment?.id}-name-box`}>
          {props.comment?.name || t("__comment.anonymous")}:
        </b> 
        <span data-testid={`${props.comment?.id}-text`}>{props.comment?.text}</span>
      </Typography>
      <Typography>
        <span onClick={handleOpenEdit} data-testid={`${props.comment?.id}-edit-action`}>
          <IconButton>
            <EditIcon color="primary" />
          </IconButton>
        </span>
        <span onClick={handleOpenDelete} data-testid={`${props.comment?.id}-delete-action`}>
          <IconButton>
            <DeleteForeverIcon color="primary" />
          </IconButton>
        </span>
      </Typography>
      <Divider />
      <ConfirmDialog
        message={t("__comment.deleteMsg")}
        open={openDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleConfirmDelete}
        id={props.comment.id}
      />
      <CommentCreateOrUpdate
        open={openEdit}
        handleClose={handleCloseEdit}
        comment={props.comment}
        action={"Update"}
        refetch={props.refetch}
      />
    </div>
  );
};

export default Comment;