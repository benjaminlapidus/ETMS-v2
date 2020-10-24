import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Box,
	Grid,
	OutlinedInput,
	TextField,
	InputLabel,
	FormControl,
	Button,
	MenuItem,
	Select,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import "date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";

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

const AssignmentsForm = (props) => {
	let { card, method, closeFromChild } = props;

	const [firstLoad, setLoad] = useState(true);

	const [id, setId] = React.useState(card.id);
	const [assigner_username, setAssignerUsername] = useState(
		card.assigner_username
	);
	const [username, setUsername] = useState(card.username);
	const [title, setTitle] = useState(card.title);
	const [due_date, setDueDate] = React.useState(new Date(card.due_date));
	const [date_completed, setDateCompleted] = React.useState(
		new Date(card.date_completed)
	);
	const [priority, setPriority] = useState(card.priority);
	const [url, setUrl] = useState(card.url);
	const [attachment, setAttachment] = useState(card.attachment);
	const [notes, setNotes] = useState(card.notes);
	const [error, setError] = useState("");
	const [users, setUsers] = React.useState([]);

	const handleUsernameChange = (event) => setUsername(event.target.value);
	const handleTitleChange = (event) => setTitle(event.target.value);
	const handleDueDateChange = (date) => setDueDate(date);
	const handlePriorityChange = (event) => setPriority(event.target.value);
	const handleUrlChange = (event) => setUrl(event.target.value);
	const handleNotesChange = (event) => setNotes(event.target.value);

	function validateInput() {
		if (username === undefined || username === "") {
			setError("Invalid username");
			return false;
		}
		if (title === undefined || title === "") {
			setError("Invalid title");
			return false;
		}
		return true;
	}

	async function getUsers() {
		let response = await fetch("/etms/api/getAllUsers/"); //TODO: Update this to pass in username to pull tasks by username
		let body = await response.json();
		setUsers(body);
	}

	async function newAssignment() {
		const response = await fetch("/etms/api/addAssignment", {
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
				assigner_username: assigner_username,
				username: username,
				title: title,
				status: "Incomplete",
				due_date: due_date,
				date_completed: date_completed,
				priority: priority,
				url: url,
				attachment: attachment,
				notes: notes,
			}),
		});
		setLoad(true);
	}

	async function updateAssignment() {
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
				id: id,
				assigner_username: assigner_username,
				username: username,
				title: title,
				status: "Incomplete",
				due_date: due_date,
				date_completed: date_completed,
				priority: priority,
				url: url,
				attachment: attachment,
				notes: notes,
			}),
		});
		setLoad(true);
	}

	const handleSubmit = (variables) => {
		if (validateInput()) {
			if (method === "POST") {
				newAssignment();
			} else {
				updateAssignment();
			}
			props.closeFromChild(false);
		} else {
			//Invalid input
			return;
		}
		setLoad(true);
	};

	if (firstLoad) {
		setLoad(false);
		getUsers();
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

						<Box display="flex">
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<Box display="flex">
									<KeyboardDatePicker
										style={{
											marginLeft: "0px",
											minWidth: "200px",
										}}
										error={false}
										color="secondary"
										helperText="Due Date"
										value={due_date || ""}
										variant="dialog"
										onChange={handleDueDateChange}
									/>
								</Box>
							</MuiPickersUtilsProvider>

							<FormControl
								color="secondary"
								fullWidth
								className={classes.padding}
								style={{ marginTop: "8px" }}
							>
								<InputLabel
									shrink
									htmlFor="standard-adornment-amount"
								>
									Priority
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={priority || "Low"}
									onChange={handlePriorityChange}
									variant="standard"
								>
									<MenuItem value={"Low"}>Low</MenuItem>
									<MenuItem value={"Medium"}>Medium</MenuItem>
									<MenuItem value={"High"}>High</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<FormControl
							color="secondary"
							fullWidth
							className={classes.padding}
							style={{
								marginTop: "8px",
								marginRight: "16px",
							}}
						>
							<InputLabel
								shrink
								htmlFor="standard-adornment-amount"
							>
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
									<MenuItem
										key={user.id}
										value={user.username}
									>
										{user.username}
									</MenuItem>
								))}
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
								htmlFor="standard-adornment-amount"
							>
								Training URL
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
								color="secondary"
								className={classes.title}
								shrink
								htmlFor="standard-adornment-amount"
							>
								Notes
							</InputLabel>
							<TextField
								id="outlined-full-width"
								multiline
								rows={3}
								rowsMax={9}
								value={notes || ""}
								onChange={handleNotesChange}
								style={{ margin: 0 }}
								helperText="This will be displayed to users - 255 character maximum"
								fullWidth
								margin="normal"
								color="secondary"
								variant="outlined"
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

export default AssignmentsForm;
