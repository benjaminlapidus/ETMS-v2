import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Box from "@material-ui/core/Box";
import WarningIcon from "@material-ui/icons/Warning";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Copyright } from "./Utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  marginTop: {
    marginTop: "16px",
  },
}));

export default function Error(props) {
  const classes = useStyles();
  let { errorMessage } = props;
  console.log(errorMessage);

  return (
  <BrowserRouter>
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <WarningIcon />
        </Avatar>
        <Typography
          className={classes.marginTop}
          color="textPrimary"
          variant="h4"
        >
          You are not signed in
        </Typography>

        <Typography
          className={classes.marginTop}
          color="textSecondary"
          variant="h5"
        >
          {errorMessage}
        </Typography>

        <a
          className={classes.marginTop}
          variant="contained"
          color="primary"
        >
          Sign in
        </a>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </BrowserRouter>
  );
}
