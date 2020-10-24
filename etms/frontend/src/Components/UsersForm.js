import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
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

const UsersForm = (props) => {
  const [id, setId] = useState(props.id);
  const [first_name, setFirstName] = useState(props.first_name);
  const [last_name, setLastName] = useState(props.last_name);
  const [email, setEmail] = useState(props.email);
  const [username, setUsername] = useState(props.username);
  const [role, setRole] = useState(props.role);
  const [error, setError] = useState("");
  const [data, upDateData] = useState([]);
  const [firstLoad, setLoad] = useState(true);

  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  function validateInput() {
    if (first_name === undefined || first_name === "") {
      setError("Invalid first name");
      return false;
    }
    if (last_name === undefined || last_name === "") {
      setError("Invalid last name");
      return false;
    }
    if (email === undefined || email === "" || email === null) {
      setError("Invalid email address");
      return false;
    }
    if (!email.includes("@")) {
      setError("Email address missing @");
      return false;
    }
    if (username === undefined || username === "") {
      setError("Invalid username");
      return false;
    }
    if (role === undefined || role === "") {
      setError("Invalid user role");
      return false;
    }

    return true;
  }

  let isLoading = false;

  async function getData() {
    const response = await fetch("/etms/api/getUserById/" + props.cardId);
    let body = await response.json();
    upDateData(body);
  }

  async function postData(toInput) {
    const response = await fetch("/etms/api/addUser", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        first_name: toInput.first_name,
        last_name: toInput.last_name,
        email: toInput.email,
        username: toInput.username,
        role: toInput.role,
      }),
    });
    props.closeFromChild(false);
  }

  async function updateData(toInput) {
    const response = await fetch("/etms/api/updateUser", {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(toInput),
    });
    props.closeFromChild(false);
  }

  const handleSubmit = (variables) => {
    const toInput = {
      id,
      first_name,
      last_name,
      email,
      username,
      role,
    };
    if (validateInput()) {
      if (props.method === "POST") {
        postData(toInput);
      } else {
        updateData(toInput);
      }
    } else {
      return;
    }
  };

  if (firstLoad) {
    if (props.method === "UPDATE") {
      getData();
    }
    setLoad(false);
  }

  const classes = useStyles();

  if (data.length !== 0 || props.method === "POST") isLoading = false; //Disable loading icon on retrieval of data

  return (
    <div>
      <Grid item container>
        <Grid item xs={1} /> {/*Left gutter*/}
        {isLoading ? (
          <CircularProgress />
        ) : (
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
                  First Name
                </InputLabel>
                <OutlinedInput
                  defaultValue={first_name || ""}
                  required
                  onChange={handleFirstNameChange}
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
                  required
                  htmlFor="standard-adornment-amount"
                >
                  Last Name
                </InputLabel>
                <OutlinedInput
                  defaultValue={last_name || ""}
                  required
                  onChange={handleLastNameChange}
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
                  required
                  htmlFor="standard-adornment-amount"
                >
                  Email
                </InputLabel>
                <OutlinedInput
                  type="email"
                  defaultValue={email || ""}
                  required
                  onChange={handleEmailChange}
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
                  required
                  htmlFor="standard-adornment-amount"
                >
                  Username
                </InputLabel>
                <OutlinedInput
                  defaultValue={username || ""}
                  required
                  onChange={handleUsernameChange}
                />
              </FormControl>

              <FormControl
                color="secondary"
                fullWidth
                className={classes.padding}
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role || ""}
                  required
                  onChange={handleRoleChange}
                >
                  <MenuItem value={"User"}>User</MenuItem>
                  <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
                  <MenuItem value={"Administrator"}>Administrator</MenuItem>
                </Select>
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
        )}
        <Grid item xs={1} /> {/*Right gutter*/}
      </Grid>
    </div>
  );
};

export default UsersForm;
