import React from "react";
import PropTypes from "prop-types";
import LibraryForm from "./LibraryForm";
import LinkIcon from "@material-ui/icons/Link";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  TextField,
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
import { Delete, Close, AddCircleOutline } from "@material-ui/icons";
import THead from "./THead";
import { getComparator, stableSort } from "./Utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  { id: "type", numeric: true, disablePadding: false, label: "Type" },
  { id: "year", numeric: true, disablePadding: false, label: "Year" },
  { id: "url", numeric: true, disablePadding: false, label: "URL" },
  { id: "location", numeric: true, disablePadding: false, label: "Location" },
  { id: "borrower", numeric: true, disablePadding: false, label: "Borrower" },
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

export default function EnhancedTable(props) {
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
  const [type, setType] = React.useState("");
  const [year, setYear] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [borrower, setBorrower] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");

  const [id, setId] = React.useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  async function getData() {
    let response = await fetch("/etms/api/getAllLibraries");
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

  const handleClick = (
    event,
    id,
    title,
    type,
    year,
    url,
    location,
    borrower
  ) => {
    setMethod("UPDATE");
    setEditIndex(id);
    setId(id);
    setTitle(title);
    setType(type);
    setYear(year);
    setUrl(url);
    setLocation(location);
    setBorrower(borrower);
    setOpenForm(true);
  };

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

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
              Library
            </Typography>
            <Tooltip title="New Feature">
              <IconButton
                onClick={(e) => {
                  handleClick();
                  setEditIndex(0);
                  setMethod("POST");
                }}
              >
                {props.role === "Administrator" ? (
                  <AddCircleOutline fontSize="default" />
                ) : null}
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            id="outlined-full-width"
            style={{ marginLeft: 0, width: "300px" }}
            placeholder="Search"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={handleSearchChange}
          />
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
                      .filter((row, index) =>
                        row.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            style={{ cursor: "pointer" }}
                            onClick={(event) => {
                              if (props.role === "Administrator") {
                                handleClick(
                                  event,
                                  row.id,
                                  row.title,
                                  row.type,
                                  row.year,
                                  row.url,
                                  row.location,
                                  row.borrower
                                );
                              }
                            }}
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
                              {row.title}
                            </TableCell>
                            <TableCell align="right">{row.type}</TableCell>
                            <TableCell align="right">{row.year}</TableCell>
                            <TableCell align="right">
                              <IconButton target="_blank" href={"//" + row.url}>
                                <LinkIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align="right">{row.location}</TableCell>
                            <TableCell align="right">{row.borrower}</TableCell>
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
                    fetch("/etms/api/deleteLibraryById/" + id, requestOptions)
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
        <LibraryForm
          id={id}
          title={title}
          type={type}
          year={year}
          url={url}
          location={location}
          borrower={borrower}
          closeFromChild={closeFromChild}
          method={method}
          cardId={editIndex}
        />
      </Dialog>
    </Grid>
  );
}
