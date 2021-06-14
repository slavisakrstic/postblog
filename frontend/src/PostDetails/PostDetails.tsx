import { useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Material UI
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import AddCommentIcon from "@material-ui/icons/AddComment";

// Routes
import { POSTS } from "../constants/routes";

// Styles
import useStyles from "./styles";

// Hooks
import { useFatchPostWithComments } from "./hooks/useFatchPostWithComments";
import { useCommentCardCreateModal } from "./hooks/usePostDetails";

// Custom components
import Loading from "../Loading";
import Comment from "./../Comment/Comment";
import CommentCreateOrUpdate from "./../CommentCreateOrUpdate/CommentCreateOrUpdate";

interface Params {
  postId: string
}

const PostDetails = () => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const { params } = useRouteMatch<Params>();

  const { data, isLoading, setFetch } = useFatchPostWithComments(Number(params.postId));
  const { openCreate, handleOpenCreate, handleCloseCreate } = useCommentCardCreateModal();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  const handleBack = (): void => {
    history.push(POSTS);
  }

  const commentsComponent = data?.comments?.map(comment => <Comment 
    comment={comment} 
    refetch={setFetch}
    key={comment.id} 
  />)

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          <List>
            <ListItem button key="Back" color="primary" onClick={handleBack} data-testid="backToPosts">
              <ListItemIcon><KeyboardBackspaceIcon color="primary" /></ListItemIcon>
              <ListItemText className={classes.textColor} >{t("__post.backToPosts")}</ListItemText>
            </ListItem>
          </List>
          <Card className={classes.root}>
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h5" component="h2" data-testid={`${data?.id}-title`}>
                {data?.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="pre" className={classes.preBox} data-testid={`${data?.id}-blog`}>
                {data?.blog}
              </Typography>
              <Box className={classes.commentAction}>
                <CardActions>
                  <span onClick={handleOpenCreate} data-testid="create-action">
                    <IconButton>
                      <AddCommentIcon color="primary" />
                    </IconButton>
                  </span>
                </CardActions>
              </Box>
            </CardContent>
          </Card>
          {commentsComponent && commentsComponent.length > 0 &&
            <Card className={classes.root}>
              <CardContent className={classes.content}>
                <Typography gutterBottom variant="h6" component="h2">Comments:</Typography>
                {commentsComponent}
              </CardContent>
            </Card>}
        </Typography>
      </Box>
      <CommentCreateOrUpdate
        open={openCreate}
        handleClose={handleCloseCreate}
        action={"Create"}
        postId={Number(params.postId)}
        refetch={setFetch}
      />
    </Container>
  );
};

export default PostDetails;