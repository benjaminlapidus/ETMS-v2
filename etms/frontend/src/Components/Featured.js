import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Tooltip,
  Box,
  IconButton,
  Card,
  CardActions,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import FeaturedForm from "./FeaturedForm";

import { formatDate, formatTime } from "./Utils";

const useStyles = makeStyles(() => ({
  appBar: {
    position: "relative",
  },
  title: {
    flex: 1,
  },
  root: {
    minWidth: 275,
  },
  dateTime: {
    marginBottom: 8,
  },
  location: {
    marginBottom: 12,
  },
  adminButtons: {
    //Buttons only visible to administrators to edit/delete featured cards
    display: "flex",
  },
  typographyStyles: {
    flex: 1,
  },
  editBar: {
    display: "flex",
  },
  appBarMargin: {
    marginLeft: "36px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Featured(props) {
  const classes = useStyles();
  const [data, upDateData] = React.useState([]);
  const [firstLoad, setLoad] = React.useState(true);
  const [card, setCard] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [method, setMethod] = React.useState(0);
  const [title, setTitle] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  let isLoading = true;

  const handleClickOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setLoad(true);
  };

  const closeFromChild = (value) => {
    setOpenForm(false);
    setLoad(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // API call to gather all data for current featured cards

  async function getData() {
    let response = await fetch("/etms/api/getAllFeatured");
    let body = await response.json();
    upDateData(body);
  }

  if (firstLoad) {
    getData();
    setLoad(false);
  }

  if (data.length > 0) isLoading = false; //Disable loading icon on retrieval of data

  return (
    <div>
      {/* Top of the featured panel (title and add button for admin) */}
      <Box className={classes.editBar}>
        <Typography
          className={classes.typographyStyles}
          variant="h5"
          color="textSecondary"
        >
          Featured
        </Typography>
        <Tooltip title="New Feature">
          <IconButton
            onClick={(e) => {
              handleClickOpenForm();
              setCard("");
              setTitle("New Training");
              setMethod("POST");
            }}
          >
            {props.role === "Administrator" ? (
              <AddCircleOutlineIcon fontSize="default" />
            ) : null}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Display loading icon while loading, otherwise display data */}

      {isLoading ? (
        <Typography
          style={{ fontStyle: "italic" }}
          className={classes.dateTime}
          color="textSecondary"
        >
          No featured trainings
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {/* Featured Card Layout */}

          {data?.map((card) => (
            <Grid item sm={12} lg={4} key={card.id}>
              <Grid item className={classes.root} component={Card} xs>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {card.title}
                  </Typography>
                  <Typography
                    className={classes.dateTime}
                    color="textSecondary"
                  >
                    {formatDate(card.date)} | {formatTime(card.time)}
                  </Typography>
                  <Typography
                    className={classes.location}
                    color="textSecondary"
                  >
                    {card.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ height: "120px" }}
                    component="p"
                  >
                    {card.description}
                  </Typography>
                </CardContent>
                <Button
                  component="a"
                  href={"mailto:" + card.url}
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Contact
                </Button>
                <Divider />
                {props.role === "Administrator" ? (
                  <CardActions className={classes.adminButtons}>
                    <Tooltip title="Edit">
                      <IconButton
                        id={card.id}
                        onClick={(e) => {
                          setCard(card);
                          setMethod("UPDATE");
                          setTitle("Edit Training");
                          handleClickOpenForm();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        id={card.id}
                        onClick={(e) => {
                          setCardIndex(e.currentTarget.id);
                          handleClickOpen();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Pop up dialog on deletion */}

                    <Dialog
                      open={open}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={handleClose}
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
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                          variant="contained"
                          color="primary"
                          title={card.title}
                          onClick={(e) => {
                            const requestOptions = {
                              method: "DELETE",
                            };
                            fetch(
                              "/etms/api/deleteFeaturedById/" + cardIndex,
                              requestOptions
                            )
                              .then((response) => {
                                handleClose();
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
                ) : null}
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pop over for add or edit - Form located in FeaturedForm.js */}

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
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.appBarMargin}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <FeaturedForm
          closeFromChild={closeFromChild}
          method={method}
          card={card}
          formHeader={title}
        />
      </Dialog>
    </div>
  );
}
