import React from "react";
import PropTypes from "prop-types";
import UsersForm from "./UsersForm";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Grid,
  Slide,
  Dialog,
  AppBar,
  Box,
  Tooltip,
} from "@material-ui/core";
import { AddCircleOutline, Delete, Close } from "@material-ui/icons";
import THead from "./THead";
import { getComparator, stableSort } from "./Utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const headCells = [
  {
    id: "first_name",
    numeric: false,
    disablePadding: true,
    label: "First Name",
  },
  { id: "last_name", numeric: true, disablePadding: false, label: "Last Name" },
  { id: "email", numeric: true, disablePadding: false, label: "Email" },
  { id: "username", numeric: true, disablePadding: false, label: "Username" },
  { id: "role", numeric: true, disablePadding: false, label: "Role" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <THead
      classes={classes}
      order={order}
      orderBy={orderBy}
      onRequestSort={onRequestSort}
      createSortHandler={createSortHandler}
      headCells={headCells}
    />
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  appBar: {
    position: "relative",
  },
  editBar: {
    display: "flex",
    width: "100%",
  },
  table: {
    minWidth: 750,
  },
  appBarMargin: {
    marginLeft: "36px",
  },
}));

export default function Users(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("lastName");
  const [data, upDateData] = React.useState([]);
  const [firstLoad, setLoad] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openForm, setOpenForm] = React.useState(false);
  const [method, setMethod] = React.useState(0);
  const [editIndex, setEditIndex] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [first_name, setFirstName] = React.useState("");
  const [last_name, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [id, setId] = React.useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  async function getData() {
    let response = await fetch("/etms/api/getAllUsers");
    let body = await response.json();
    upDateData(body);
  }

  const closeFromChild = (value) => {
    setOpenForm(false);
    setLoad(true);
  };

  if (firstLoad) {
    getData();
    setLoad(false);
  }

  const handleCloseForm = () => {
    setOpenForm(false);
    setLoad(true);
  };

  const handleClick = (event, id, first, last, role, email, username) => {
    setEditIndex(id);
    setMethod("UPDATE");
    setTitle(first + " " + last);
    setFirstName(first);
    setLastName(last);
    setRole(role);
    setEmail(email);
    setUsername(username);
    setId(id);
    setOpenForm(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <Grid container direction="column">
      <Grid item container>
        <Grid item xs={false} sm={1} />
        <Grid item xs={12} sm={10}>
          <Box className={classes.editBar}>
            <Typography
              style={{ flex: "auto" }}
              className={classes.typographyStyles}
              variant="h5"
              color="textSecondary"
            >
              Users
            </Typography>
            <Tooltip title="New Feature">
              <IconButton
                onClick={(e) => {
                  handleClick();
                  setEditIndex(0);
                  setTitle("New User");
                  setMethod("POST");
                }}
              >
                <AddCircleOutline fontSize="default" />
              </IconButton>
            </Tooltip>
          </Box>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {stableSort(data, getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            style={{ cursor: "pointer" }}
                            onClick={(event) =>
                              handleClick(
                                event,
                                row.id,
                                row.first_name,
                                row.last_name,
                                row.role,
                                row.email,
                                row.username
                              )
                            }
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                          >
                            <TableCell padding="checkbox" />
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.first_name}
                            </TableCell>
                            <TableCell align="right">{row.last_name}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.username}</TableCell>
                            <TableCell align="right">{row.role}</TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </Grid>
        <Grid item xs={false} sm={1} />
      </Grid>

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
            <Box className={classes.editBar}>
              <Typography
                style={{ lineHeight: "3", flex: "auto" }}
                variant="h6"
                className={classes.appBarMargin}
              >
                {title}
              </Typography>
              {method === "UPDATE" ? (
                <IconButton
                  style={{ height: "48px", marginTop: "6px" }}
                  onClick={(e) => {
                    const requestOptions = {
                      method: "DELETE",
                    };
                    fetch("/etms/api/deleteUserById/" + id, requestOptions)
                      .then((response) => {
                        closeFromChild();
                        setLoad(true);
                        return response.json();
                      })
                      .then((result) => {});
                  }}
                >
                  <Delete fontSize="default" />
                </IconButton>
              ) : null}
            </Box>
          </Toolbar>
        </AppBar>
        <UsersForm
          id={id}
          first_name={first_name}
          last_name={last_name}
          email={email}
          role={role}
          username={username}
          closeFromChild={closeFromChild}
          method={method}
          cardId={editIndex}
        />
      </Dialog>
    </Grid>
  );
}
