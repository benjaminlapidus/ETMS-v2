import React from "react";

import {
  Typography,
  TextField,
  Divider,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  ListItemText,
  ListSubheader,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CardActions,
  DialogTitle,
  IconButton,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  AddCircleOutline,
  FiberManualRecord,
  Edit,
  Delete,
  Check,
  ThumbDown,
  Close,
} from "@material-ui/icons/";
import AssignmentDisplay from "./AssignmentDisplay";
import AssignmentsForm from "./AssignmentsForm";
import { formatDate, priorityColor } from "./Utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
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

export default function Assignments(props) {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [firstLoad, setLoad] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [card, setCard] = React.useState("");
  const [filter, setFilter] = React.useState("Any");
  const [openDelete, setOpenDelete] = React.useState(false);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [method, setMethod] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleButtonChange = (filterQuery) => setFilter(filterQuery);

  async function getData() {
    let response = await fetch("/etms/api/getAllAssignments"); //TODO: Update this to pass in username to pull tasks by username
    let body = await response.json();
    setData(body);
    setLoad(false);
  }

  if (firstLoad) {
    getData();
  }

  const openDeleteDialog = () => {
    setOpenDelete(true);
  };

  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setLoad(true);
  };

  const closeDeleteDialog = (type) => {
    if (type === "delete") {
      setCard("");
    }
    setLoad(true);
    setOpenDelete(false);
  };

  const closeFromChild = () => {
    setOpenForm(false);
    setLoad(true);
  };

  async function updateApproved(card) {
    const response = await fetch("/etms/api/updateAssignment", {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        id: card.id,
        assigner_username: card.assigner_username,
        username: card.username,
        title: card.title,
        status: "Complete",
        due_date: card.due_date,
        date_completed: card.date_completed,
        priority: card.priority,
        url: card.url,
        attachment: card.attachment,
        notes: card.notes,
      }),
    });
    setLoad(true);
    setCard("");
  }

  async function updateRejected(card) {
    const response = await fetch("/etms/api/updateAssignment", {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        id: card.id,
        assigner_username: card.assigner_username,
        username: card.username,
        title: card.title,
        status: "Incomplete",
        due_date: card.due_date,
        date_completed: "",
        priority: card.priority,
        url: card.url,
        attachment: "",
        notes: card.notes,
      }),
    });
    setLoad(true);
    setCard("");
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={false} sm={1} />
        <Grid item xs={12} sm={4}>
          <Box style={{ display: "flex" }}>
            <Typography
              className={classes.typographyStyles}
              variant="h5"
              color="textSecondary"
            >
              Assignments
            </Typography>
            <IconButton
              onClick={(e) => {
                setCard("");
                setMethod("POST");
                handleClickOpenForm();
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Box>
          <TextField
            id="outlined-full-width"
            style={{ marginLeft: 0 }}
            placeholder="Search"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={handleSearchChange}
          />

          <Divider light style={{ margin: "16px 0px" }} />

          <FormControl component="fieldset" style={{ width: "100%" }}>
            <FormLabel component="legend" style={{ width: "100%" }}>
              Status
            </FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue="Any"
              style={{ width: "100%", display: "flex" }}
            >
              <FormControlLabel
                value="Any"
                control={<Radio color="primary" />}
                labelPlacement="bottom"
                style={{ flex: "auto" }}
                label="Any"
                onChange={() => handleButtonChange("Any")}
              />
              <FormControlLabel
                value="Incomplete"
                control={<Radio color="primary" />}
                labelPlacement="bottom"
                style={{ flex: "auto" }}
                label="Incomplete"
                onChange={() => handleButtonChange("Incomplete")}
              />
              <FormControlLabel
                value="Pending"
                control={<Radio color="primary" />}
                labelPlacement="bottom"
                style={{ flex: "auto" }}
                label="Pending"
                onChange={() => handleButtonChange("Pending")}
              />

              <FormControlLabel
                value="Complete"
                control={<Radio color="primary" />}
                labelPlacement="bottom"
                style={{ flex: "auto" }}
                label="Complete"
                onChange={() => handleButtonChange("Complete")}
              />
            </RadioGroup>
          </FormControl>

          <Divider light style={{ margin: "16px 0px" }} />

          <List
            component="nav"
            className={classes.listHeight}
            aria-label="contacts"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Active Assignments
              </ListSubheader>
            }
          >
            {data
              ?.filter(
                (assignment) =>
                  (assignment.status === filter || filter === "Any") &&
                  (assignment.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    assignment.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()))
              )
              .map((card) => (
                <div key={card.id}>
                  <ListItem onClick={() => setCard(card)} button>
                    <ListItemIcon>
                      <Tooltip title={card.priority + " priority"}>
                        <FiberManualRecord
                          color={priorityColor(card.priority)}
                        />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary={card.username}
                      secondary={
                        card.title + " [Due " + formatDate(card.due_date) + "]"
                      }
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
          </List>
        </Grid>

        <Grid item xs={false} sm={1} />

        <Grid item xs={12} sm={5}>
          <AssignmentDisplay card={card} />
          <CardActions>
            {card.id ? (
              <div>
                <Tooltip title="Edit">
                  <IconButton
                    id={card.id}
                    onClick={(e) => {
                      setMethod("UPDATE");
                      handleClickOpenForm();
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    id={card.id}
                    onClick={(e) => {
                      setCardIndex(e.currentTarget.id);
                      openDeleteDialog();
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Approve">
                  <IconButton
                    id={card.id}
                    onClick={(e) => {
                      updateApproved(card);
                    }}
                  >
                    <Check />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Reject">
                  <IconButton
                    id={card.id}
                    onClick={(e) => {
                      updateRejected(card);
                    }}
                  >
                    <ThumbDown />
                  </IconButton>
                </Tooltip>
              </div>
            ) : null}

            {/* Pop up dialog on deletion */}

            <Dialog
              open={openForm}
              onClose={handleCloseForm}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseForm}
                    aria-label="close"
                  >
                    <Close />
                  </IconButton>
                </Toolbar>
              </AppBar>

              <AssignmentsForm
                card={card}
                method={method}
                closeFromChild={closeFromChild}
              />
            </Dialog>

            <Dialog
              open={openDelete}
              TransitionComponent={Transition}
              keepMounted
              onClose={closeDeleteDialog}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"Are you sure?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  This entry will be permenently deleted.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => closeDeleteDialog("cancel")}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  title={card.title}
                  onClick={(e) => {
                    const requestOptions = {
                      method: "DELETE",
                    };
                    fetch(
                      "/etms/api/deleteAssignmentById/" + cardIndex,
                      requestOptions
                    )
                      .then((response) => {
                        closeDeleteDialog("delete");
                        setLoad(true);
                        return response.json();
                      })
                      .then((result) => {});
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </CardActions>
        </Grid>
        <Grid item xs={false} sm={1} />
      </Grid>
    </div>
  );
}
