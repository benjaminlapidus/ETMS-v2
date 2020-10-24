import React from "react";
import { Typography, Divider, Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { formatDate } from "./Utils";

const useStyles = makeStyles((theme) => ({
  typographyStyles: {
    flex: 1,
  },
  horizontalLine: {
    margin: "16px 0px",
  },
  listHeight: {
    maxHeight: "360px",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function AssignmentDisplay(props) {
  const classes = useStyles();
  let { card, access } = props;
  return (
    <div>
      <Box style={{ display: "flex" }}>
        <Typography
          className={classes.typographyStyles}
          variant="h4"
          color="textPrimary"
        >
          {card.title ? card.title : ""}
        </Typography>
      </Box>

      <Box style={{ display: "flex", paddingTop: "8px" }}>
        <Typography
          className={classes.typographyStyles}
          variant="body1"
          color="textSecondary"
        >
          {card.assigner_username
            ? "Assigned by " + card.assigner_username
            : ""}
        </Typography>
        <Typography
          className={classes.typographyStyles}
          align="right"
          variant="subtitle1"
          color="textSecondary"
        >
          {card.due_date ? "Due " + formatDate(card.due_date) : ""}
        </Typography>
      </Box>

      <Box style={{ display: "flex", paddingTop: "8px" }}>
        <Typography
          className={classes.typographyStyles}
          variant="body1"
          color="textSecondary"
        >
          {access !== "dashboard" && card.username
            ? "Assigned to " + card.username
            : ""}
        </Typography>
        <Typography
          className={classes.typographyStyles}
          align="right"
          variant="subtitle1"
          color="textSecondary"
        >
          {card.date_completed
            ? "Completed on " + formatDate(card.date_completed)
            : ""}
        </Typography>
      </Box>

      {card.notes ? <Divider style={{ margin: "16px 0px" }} light /> : null}
      {card.notes ? (
        <div>
          <Typography
            className={classes.typographyStyles}
            align="left"
            variant="subtitle2"
            color="textSecondary"
          >
            Note from Supervisor
          </Typography>
          <Typography
            className={classes.typographyStyles}
            align="left"
            variant="h6"
            color="textPrimary"
          >
            {card.notes}
          </Typography>
        </div>
      ) : (
        ""
      )}

      {card.url || card.attachment ? (
        <Divider className={classes.horizontalLine} light />
      ) : null}
      <Box style={{ display: "flex" }}>
        {card.url ? (
          <Button
            component="a"
            href={"//" + card.url}
            target="_blank"
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
          >
            Go to assignment
          </Button>
        ) : (
          ""
        )}

        {card.attachment ? (
          <Button
            component="a"
            href={card.attachment}
            variant="outlined"
            color="secondary"
            fullWidth
            size="large"
            style={{ marginLeft: "8px" }}
          >
            Attachment
          </Button>
        ) : (
          ""
        )}
      </Box>
    </div>
  );
}
