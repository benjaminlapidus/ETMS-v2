import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  OutlinedInput,
  InputLabel,
  FormControl,
  Button,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(3),
    },
    padding: theme.spacing(5),
  },
  title: {
    flex: 1,
    padding: theme.spacing(1),
  },
  padding: {
    paddingBottom: "18px",
  },
  margin: {
    marginTop: "18px",
  },
}));

const LibraryForm = (props) => {
  let { closeFromChild, method, cardId } = props;

  const [firstLoad, setLoad] = useState(true);
  const [type, setType] = useState(props.type);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(props.title);
  const [year, setYear] = useState(props.year);
  const [url, setUrl] = useState(props.url);
  const [location, setLocation] = useState(props.location);
  const [borrower, setBorrower] = useState(props.borrower);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleYearChange = (event) => setYear(event.target.value);
  const handleUrlChange = (event) => setUrl(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleBorrowerChange = (event) => setBorrower(event.target.value);
  const handleTypeChange = (event) => setType(event.target.value);

  function validateInput() {
    if (title === undefined || title === "") {
      setError("Invalid title");
      return false;
    }
    if (year === undefined || year === "") {
      setError("Invalid year");
      return false;
    }
    if (type === undefined || type === "") {
      setError("Invalid type");
      return false;
    }

    return true;
  }

  async function postData() {
    const response = await fetch("/etms/api/addLibrary", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        title: title,
        type: type,
        year: year,
        is_available: "0",
        url: url,
        location: location,
        borrower: borrower,
      }),
    });
    props.closeFromChild(false);
  }

  async function updateData() {
    const response = await fetch("/etms/api/updateLibrary/", {
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
        id: props.id,
        title: title,
        type: type,
        year: year,
        is_available: "0",
        url: url,
        location: location,
        borrower: borrower,
      }),
    });
    props.closeFromChild(false);
  }

  const handleSubmit = (variables) => {
    if (validateInput()) {
      if (props.method === "POST") {
        postData();
      } else {
        updateData();
      }
    } else {
      return;
    }
  };

  if (firstLoad) {
    setLoad(false);
  }

  const classes = useStyles();

  return (
    <div>
      <Grid item container>
        <Grid item xs={1} /> {/*Left gutter*/}
        <Grid item xs={10}>
          {error ? (
            <Alert
              style={{ marginTop: "16px" }}
              variant="filled"
              severity="error"
            >
              <AlertTitle>Error</AlertTitle>
              Invalid input — <strong>{error}</strong>
            </Alert>
          ) : null}

          <form className={classes.root} autoComplete="off">
            <FormControl
              color="secondary"
              fullWidth
              className={classes.padding}
            >
              <InputLabel
                className={classes.title}
                shrink
                required
                htmlFor="standard-adornment-amount"
              >
                Title
              </InputLabel>
              <OutlinedInput
                defaultValue={title || ""}
                required
                onChange={handleTitleChange}
              />
            </FormControl>

            <FormControl
              color="secondary"
              fullWidth
              className={classes.padding}
              style={{ marginTop: "8px" }}
            >
              <InputLabel required shrink htmlFor="standard-adornment-amount">
                Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type || ""}
                onChange={handleTypeChange}
                variant="standard"
              >
                <MenuItem value={"Book"}>Book</MenuItem>
                <MenuItem value={"DVD"}>DVD</MenuItem>
                <MenuItem value={"VHS"}>VHS</MenuItem>
                <MenuItem value={"Online"}>Online</MenuItem>
                <MenuItem value={"Booklet/Pamphlet"}>Booklet/Pamphlet</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              color="secondary"
              fullWidth
              className={classes.padding}
            >
              <InputLabel
                className={classes.title}
                shrink
                required
                htmlFor="standard-adornment-amount"
              >
                Year
              </InputLabel>
              <OutlinedInput
                defaultValue={year || ""}
                required
                onChange={handleYearChange}
              />
            </FormControl>

            <FormControl
              color="secondary"
              fullWidth
              className={classes.padding}
            >
              <InputLabel
                className={classes.title}
                shrink
                htmlFor="standard-adornment-amount"
              >
                URL
              </InputLabel>
              <OutlinedInput
                defaultValue={url || ""}
                required
                onChange={handleUrlChange}
              />
            </FormControl>

            <FormControl
              color="secondary"
              fullWidth
              className={classes.padding}
            >
              <InputLabel
                className={classes.title}
                shrink
                htmlFor="standard-adornment-amount"
              >
                Location
              </InputLabel>
              <OutlinedInput
                defaultValue={location || ""}
                required
                onChange={handleLocationChange}
              />
            </FormControl>

            <FormControl
              color="secondary"
              fullWidth
              className={classes.padding}
            >
              <InputLabel
                className={classes.title}
                shrink
                htmlFor="standard-adornment-amount"
              >
                Borrower
              </InputLabel>
              <OutlinedInput
                defaultValue={borrower || ""}
                required
                onChange={handleBorrowerChange}
              />
            </FormControl>

            <Button
              variant="contained"
              onClickCapture={handleSubmit}
              color="primary"
              fullWidth
              size="large"
            >
              Submit
            </Button>
          </form>
        </Grid>
        <Grid item xs={1} /> {/*Right gutter*/}
      </Grid>
    </div>
  );
};

export default LibraryForm;
