import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    minWidth: 275,
    marginTop: "5px"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    marginBottom: "40px"
  },
  preBox: {
    whiteSpace: "break-spaces"
  },
  commentAction: {
    width: "60px",
    position: "relative",
    float: "right"
  },
  textColor: {
    color: "#3f51b5"
  }
}));
