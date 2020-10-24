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

export default function TrainingLogDisplay(props) {
  const classes = useStyles();

  let { card } = props;

  return (
    <div>
      <Box style={{ display: "flex" }}>
        <Box>
          <Typography
            className={classes.typographyStyles}
            variant="h4"
            color="textPrimary"
          >
            {card.title ? card.title : ""}
          </Typography>
        </Box>
        <Box style={{ flex: "auto" }}>
          <Typography
            className={classes.typographyStyles}
            align="right"
            variant="subtitle1"
            color="textSecondary"
          >
            {card.date ? formatDate(card.date) : ""}
          </Typography>
        </Box>
      </Box>

      {card.id ? (
        <div>
          <Divider style={{ margin: "16px 0px" }} light />

          <Typography
            className={classes.typographyStyles}
            align="left"
            variant="body1"
            color="textSecondary"
          >
            Provider: {card.provider}
          </Typography>

          <Typography
            className={classes.typographyStyles}
            align="left"
            variant="body1"
            color="textSecondary"
          >
            Complete: {card.is_complete}
          </Typography>

          <Typography
            className={classes.typographyStyles}
            align="left"
            variant="body1"
            color="textSecondary"
          >
            Hours: {card.hours}
          </Typography>
        </div>
      ) : null}

      {card.notes ? <Divider style={{ margin: "16px 0px" }} light /> : null}
      {card.notes ? (
        <div>
          <Typography
            className={classes.typographyStyles}
            align="left"
            variant="subtitle2"
            color="textSecondary"
          >
            Notes
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
      {card.id ? (
        <div>
          <Divider className={classes.horizontalLine} light />
          <Button
            component="a"
            disabled={!card.attachment}
            href={card.attachment}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Attachment
          </Button>
        </div>
      ) : null}

      {card.url ? <Divider className={classes.horizontalLine} light /> : null}
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
    </div>
  );
}
