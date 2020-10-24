
import React from "react";
import TrainingLog from "./Components/TrainingLog";
import Library from "./Components/Library";
import Assignments from "./Components/Assignments";
import Users from "./Components/Users";
import Dashboard from "./Components/Dashboard";
import Error from "./Components/Error";
import { Link } from "react-router-dom";
import axios from "axios";
import { FileService } from "./Components/FileService.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Switch} from "react-router-dom";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import MenuIcon from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NotesIcon from "@material-ui/icons/Notes";
import { uuidv4, getQueryVariable } from "./Components/Utils";
import { createBrowserHistory } from 'history';

//window.history.replaceState(null, null, "/etms/dashboard");

const drawerWidth = 240;
const fileService = new FileService();
let session;
let errorMessage;

/*

Link the returned username from LDAP here

*/



let username=getQueryVariable('user');
console.log("111 USERNAME: " + username);


var clean_uri = window.location.protocol + "//" + window.location.host + window.location.pathname;
window.history.replaceState({}, document.title, clean_uri);


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    toolbar: theme.mixins.toolbar,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

  export const history = createBrowserHistory({
      basename: process.env.PUBLIC_URL
  });


export default function App(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [user, setUser] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [isError, setIsError] = React.useState("false");
  const [firstLoad, setLoad] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function getUser() {
    axios.get("/etms/api/getUserBySession/" + session).then((response) => {
      let body = response.data;
      if (body === "") {
        errorMessage = "Invalid session.";
        setIsError("true");
      } else {
        setRole(body.role);
        setIsError("false");
      }
    });
  }

  function setNewSessionByUsername() {
    let newSession = uuidv4();
    axios.get("/etms/api/getAllUsers/").then((response) => {
      let body = response.data;
      let i;
      for (let i = 0; i < body.length; i++) {
        if (username === body[i].username) {
          setRole(body[i].role);
          const response = fetch("/etms/api/updateUser", {
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
              id: body[i].id,
              username: body[i].username,
              first_name: body[i].first_name,
              last_name: body[i].last_name,
              email: body[i].email,
              role: body[i].role,
              session: newSession,
            }),
          });
          sessionStorage.setItem("session", newSession);
          return;
        }
      }
      errorMessage =
        "Username not found in Users Database. Contact administrator.";
      setIsError("true");
    });
  }

  if (firstLoad) {
    validateUser();
    setLoad(false);
  }

  async function validateUser() {
    session = sessionStorage.getItem("session");
    if (session === null) {
      console.log("username: " + username);
      console.log(username);
      console.log(typeof username);
      if (username !== null && typeof username === "string") {
        await setNewSessionByUsername();
        setIsError("false");
        return;
      } else {
        errorMessage = "Username not specified. Please log in again.";
        setIsError("true");
      }
    } else {
      await getUser();
    }
  }

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleLogOut = (event) => {
    console.log("Log out!");
    sessionStorage.removeItem("session");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      {console.log("isError: " + isError)}
      {isError === "false" ? (
        <Router basename={'/etms/'}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: openDrawer,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: openDrawer,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Employee Training Management System
              </Typography>

              <Tooltip title="Log out">
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  href={`${process.env.PUBLIC_URL}`}
                  onClick={handleLogOut}
                  color="inherit"
                >
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: openDrawer,
              [classes.drawerClose]: !openDrawer,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: openDrawer,
                [classes.drawerClose]: !openDrawer,
              }),
            }}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem
                button
                key={"Dashboard"}
                color="primary"
                to="/dashboard"
                component={Link}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItem>
              <ListItem
                button
                key={"Training Log"}
                color="primary"
                to="/training-log"
                component={Link}
              >
                <ListItemIcon>
                  <NotesIcon />
                </ListItemIcon>
                <ListItemText primary={"Training Log"} />
              </ListItem>
              <ListItem
                button
                key={"Resources"}
                color="primary"
                to="/library"
                component={Link}
              >
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary={"Resources"} />
              </ListItem>
            </List>
            {role === "Administrator" || role === "Supervisor" ? (
              <div>
                <Divider />
                <List>
                  <ListItem
                    button
                    key={"Assignments"}
                    color="primary"
                    to="/assignments"
                    component={Link}
                  >
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Assignments"} />
                  </ListItem>
                </List>
              </div>
            ) : null}
            {role === "Administrator" ? (
              <List>
                <ListItem
                  button
                  key={"Users"}
                  color="primary"
                  to="/users"
                  component={Link}
                >
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Users"} />
                </ListItem>
              </List>
            ) : null}
          </Drawer>

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch basename={'/etms/'}>
                <Route path="/dashboard">
                    <Dashboard role={role} />
                </Route>
                <Route path="/training-log">
                    <TrainingLog role={role} />
                </Route>
                <Route path="/library">
                    <Library role={role} />
                </Route>
                <Route path="/assignments">
                    <Assignments role={role} />
                </Route>
                <Route path="/users">
                    <Users role={role} />
                </Route>
            </Switch>
          </main>
        </Router>
      ) : (
        <Error errorMessage={errorMessage} />
      )}
    </div>
  );
}


