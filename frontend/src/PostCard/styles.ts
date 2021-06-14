import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  root: {
    minWidth: 275,
    height: "220px",
    marginTop: "5px"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    marginBottom: "40px",
    maxHeight: "120px"
  },
  preBox: {
    whiteSpace: "break-spaces"
  }
}));
