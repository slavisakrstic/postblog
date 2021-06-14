import { useTranslation } from "react-i18next";

// Material UI
import { 
  AppBar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography 
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import { usePostCardCreateModal } from "./hooks/useCreatePost";

// Styles
import useStyles from "./styles";
import PostCreateOrUpdate from "./../PostCreateOrUpdate";

// Hooks
import { useFatchPosts } from "../Post/hooks/useFatchPosts";

const Layout = ({ children }: any) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { openCreate, handleOpenCreate, handleCloseCreate } = usePostCardCreateModal();
  const { setFetch } = useFatchPosts();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap data-testid="general-title">
            {t("__general.title")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button key="New" color="primary" onClick={handleOpenCreate} data-testid="new-post">
              <ListItemIcon><CreateIcon color="primary" /></ListItemIcon>
              <ListItemText className={classes.textColor} >{t("__post.create")}</ListItemText>
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        {children}
      </main>
      <PostCreateOrUpdate
        open={openCreate}
        handleClose={handleCloseCreate}
        action={"Create"}
        refetch={setFetch}
      />
    </div>
  );
}

export default Layout;