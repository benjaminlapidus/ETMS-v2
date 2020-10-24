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
  Tooltip,
  Select,
  InputLabel,
  MenuItem,
  ListItemText,
  ListSubheader,
  FormControl,
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
import { AddCircleOutline, Edit, Delete, Close } from "@material-ui/icons/";
import TrainingLogDisplay from "./TrainingLogDisplay";
import TrainingLogForm from "./TrainingLogForm";
import { formatDate } from "./Utils";

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
    maxHeight: "380px",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TrainingLog(props) {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [firstLoad, setLoad] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [card, setCard] = React.useState("");
  const [openDelete, setOpenDelete] = React.useState(false);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [method, setMethod] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  const [username, setUsername] = React.useState(
    atob(sessionStorage.getItem("username"))
  );

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleUsernameChange = (event) => {
    console.log("Username: " + event.target.value);
    getData(event.target.value);
  };

  async function getData(user) {
    let response = await fetch("/etms/api/getLogByUsername/" + user); //TODO: Update this to pass in username to pull tasks by username
    let body = await response.json();
    setUsername(user);
    setData(body);
    setLoad(false);
  }

  async function getUsers() {
    let response = await fetch("/etms/api/getAllUsers/"); //TODO: Update this to pass in username to pull tasks by username
    let body = await response.json();
    setUsers(body);
  }

  const closeFromChild = () => {
    setOpenForm(false);
    setLoad(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setLoad(true);
  };

  const closeDeleteDialog = (type) => {
    if (type === "delete") {
      setCard("");
    }
    setOpenDelete(false);
  };

  if (firstLoad) {
    getUsers();
    getData(username);
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
              Training Log
            </Typography>

            <IconButton
              onClick={(e) => {
                setCard("");
                setMethod("POST");
                setOpenForm(true);
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

          {props.role === "Administrator" || props.role === "Supervisor" ? (
            <div>
              <FormControl
                color="secondary"
                fullWidth
                className={classes.padding}
                style={{
                  marginTop: "8px",
                  marginRight: "16px",
                }}
              >
                <InputLabel shrink htmlFor="standard-adornment-amount">
                  Username
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={username || ""}
                  onChange={handleUsernameChange}
                  variant="standard"
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.username}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider light style={{ margin: "16px 0px" }} />
            </div>
          ) : null}

          <List
            component="nav"
            className={classes.listHeight}
            aria-label="contacts"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Training Log
              </ListSubheader>
            }
          >
            {data
              .filter((log) =>
                log.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((card) => (
                <div key={card.id}>
                  <ListItem onClick={() => setCard(card)} button>
                    <ListItemText
                      primary={card.title}
                      secondary={formatDate(card.date)}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
          </List>
        </Grid>

        <Grid item xs={false} sm={1} />

        <Grid item xs={12} sm={5}>
          <TrainingLogDisplay card={card} />
          <CardActions>
            {card.id ? (
              <div>
                <Tooltip title="Edit">
                  <IconButton
                    id={card.id}
                    onClick={(e) => {
                      setMethod("UPDATE");
                      setOpenForm(true);
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
                      setOpenDelete(true);
                    }}
                  >
                    <Delete />
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

              <TrainingLogForm
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
                      "/etms/api/deleteLogById/" + cardIndex,
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
