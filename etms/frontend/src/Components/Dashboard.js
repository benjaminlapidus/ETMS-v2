import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Divider } from "@material-ui/core";
import AssignmentsAlert from "./AssignmentsAlert";
import Featured from "./Featured";

const useStyles = makeStyles({
  horizontalLine: {
    margin: "32px",
  },
});

export default function Dashboard(props) {
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <Grid item container>
        <Grid item xs={false} sm={1} />
        <Grid item xs={12} sm={10}>
          <Featured role={props.role} />
          <Divider className={classes.horizontalLine} />
          <AssignmentsAlert role={props.role} />
        </Grid>
        <Grid item xs={12} sm={10}></Grid>
        <Grid item xs={false} sm={1} />
      </Grid>
    </Grid>
  );
}
