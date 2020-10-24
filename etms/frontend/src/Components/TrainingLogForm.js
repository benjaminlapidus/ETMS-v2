import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
	Box,
	Grid,
	OutlinedInput,
	Divider,
	TextField,
	InputLabel,
	Fab,
	DialogContentText,
	FormControl,
	Button,
	MenuItem,
	Select,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { FileService } from "./FileService.js";
import PublishIcon from "@material-ui/icons/Publish";
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

const TrainingLogForm = (props) => {
	let { card, method, closeFromChild } = props;

	const [firstLoad, setLoad] = useState(true);
	const [title, setTitle] = useState(card.title);
	const [date, setDate] = React.useState(new Date(card.due_date));
	const [isComplete, setIsComplete] = React.useState(card.is_complete);
	const [provider, setProvider] = useState(card.provider);
	const [type, setType] = useState(card.type);
	const [hours, setHours] = useState(card.hours);
	const [attachment, setAttachment] = useState(card.attachment);
	const [notes, setNotes] = useState(card.notes);
	const [error, setError] = useState("");

	const fileService = new FileService();

	console.log("Attachment: " + card.attachment);

	const handleTitleChange = (event) => setTitle(event.target.value);
	const handleDateChange = (date) => setDate(date);
	const handleIsCompleteChange = (event) => setIsComplete(event.target.value);
	const handleProviderChange = (event) => setProvider(event.target.value);
	const handleTypeChange = (event) => setType(event.target.value);
	const handleHoursChange = (event) => setHours(event.target.value);
	const handleAttachmentChange = (event) => setAttachment(event.target.value);
	const handleNotesChange = (event) => setNotes(event.target.value);

	function validateInput() {
		if (title === undefined || title === "") {
			setError("Invalid title");
			return false;
		}
		if (hours === undefined || hours === "") {
			setError("Invalid hours");
			return false;
		}
		if (provider === undefined || provider === "") {
			setError("Invalid provider");
			return false;
		}

		return true;
	}

	const handleUploadFile = (event) => {
		const data = new FormData();
		//using File API to get chosen file
		console.log("here");
		data.append("file", event.target.files[0]);
		data.append("name", "my_file");
		//calling async Promise and handling response or error situation
		fileService
			.uploadFileToServer(data)
			.then((response) => {
				setAttachment(response.data.fileDownloadUri);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	async function newLog() {
		const response = await fetch("/etms/api/addLog", {
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
				username: atob(sessionStorage.getItem("username")),
				entry_status: "Hello",
				title: title,
				date: date,
				is_complete: isComplete,
				provider: provider,
				type: type,
				hours: hours,
				attachment: attachment,
				notes: notes,
			}),
		});
		setLoad(true);
	}

	async function updateLog() {
		const response = await fetch("/etms/api/updateLog/", {
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
				username: atob(sessionStorage.getItem("username")),
				entry_status: "Hello",
				title: title,
				date: date,
				is_complete: isComplete,
				provider: provider,
				type: type,
				hours: hours,
				attachment: attachment,
				notes: notes,
			}),
		});
		setLoad(true);
	}

	const handleSubmit = (variables) => {
		if (validateInput()) {
			if (method === "POST") {
				newLog();
			} else {
				updateLog();
			}
		} else {
			return;
		}
		closeFromChild(false);
	};

	if (firstLoad) {
		setLoad(false);
	}

	const classes = useStyles();

	return (
		<div>
			<Grid item container>
				<Grid item xs={1} /> {/*Left gutter*/}
				<Grid style={{ minWidth: "500px" }} item xs={10}>
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
								Training Title
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
						>
							<InputLabel
								shrink
								required
								htmlFor="standard-adornment-amount"
							>
								Provider
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={provider || ""}
								onChange={handleProviderChange}
								variant="standard"
							>
								<MenuItem value={"Blackboard"}>
									Blackboard
								</MenuItem>
								<MenuItem value={"E.D.N.Y."}>E.D.N.Y.</MenuItem>
								<MenuItem value={"F.J.C."}>F.J.C.</MenuItem>
								<MenuItem value={"J.O.U."}>J.O.U.</MenuItem>
								<MenuItem value={"Private Vendor"}>
									Private Vendor
								</MenuItem>
								<MenuItem value={"S.D.S.O."}>S.D.S.O.</MenuItem>
								<MenuItem value={"U.S.C.A.O."}>
									U.S.C.A.O.
								</MenuItem>
								<MenuItem value={"Other"}>Other</MenuItem>
							</Select>
						</FormControl>

						<FormControl
							color="secondary"
							fullWidth
							className={classes.padding}
						>
							<InputLabel
								shrink
								htmlFor="standard-adornment-amount"
							>
								Type/Medium
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={type || ""}
								onChange={handleTypeChange}
								variant="standard"
							>
								<MenuItem value={"Book"}>Book</MenuItem>
								<MenuItem value={"Online"}>Online</MenuItem>
								<MenuItem value={"In Person"}>
									In Person
								</MenuItem>
								<MenuItem value={"Webinar - Prerecorded"}>
									Webinar - Prerecorded
								</MenuItem>
								<MenuItem value={"Webinar - Instructor Led"}>
									Webinar - Instructor Led
								</MenuItem>
								<MenuItem value={"Webinar - DVD/CD"}>
									Webinar - DVD/CD
								</MenuItem>
								<MenuItem value={"Other"}>Other</MenuItem>
							</Select>
						</FormControl>

						<FormControl
							color="secondary"
							className={classes.padding}
						>
							<InputLabel
								className={classes.title}
								shrink
								required
								type="number"
								htmlFor="standard-adornment-amount"
							>
								Hours
							</InputLabel>
							<OutlinedInput
								defaultValue={hours || ""}
								required
								onChange={handleHoursChange}
							/>
						</FormControl>

						<Box display="flex">
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
									Progress
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={isComplete || ""}
									onChange={handleIsCompleteChange}
									variant="standard"
								>
									<MenuItem value={"Complete"}>
										Complete
									</MenuItem>
									<MenuItem value={"Incomplete"}>
										Incomplete
									</MenuItem>
								</Select>
							</FormControl>

							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<Box display="flex">
									<KeyboardDatePicker
										style={{
											marginLeft: "0px",
											minWidth: "200px",
										}}
										error={false}
										color="secondary"
										helperText="Date"
										value={date || ""}
										variant="dialog"
										onChange={handleDateChange}
									/>
								</Box>
							</MuiPickersUtilsProvider>
						</Box>

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
								rows={2}
								rowsMax={4}
								value={notes || ""}
								onChange={handleNotesChange}
								style={{ margin: 0 }}
								helperText="255 character maximum"
								fullWidth
								margin="normal"
								color="secondary"
								variant="outlined"
							/>
						</FormControl>

						<Divider style={{ margin: "8px" }} light />

						<Box style={{ display: "flex" }}>
							<DialogContentText id="alert-dialog-slide-description">
								If applicable, please upload proof of assignment
								completion (e.g. certificate, picture, etc.)
							</DialogContentText>

							<Grid
								container
								justify="center"
								alignItems="center"
							>
								<input
									style={{ display: "none" }}
									id="contained-button-file"
									multiple
									type="file"
									onChange={handleUploadFile}
								/>
								<label htmlFor="contained-button-file">
									<Fab
										variant="extended"
										component="span"
										style={{
											backgroundColor:
												attachment === null ||
												attachment === undefined
													? ""
													: "lime",
										}}
									>
										<PublishIcon />
										{attachment === null ||
										attachment === undefined
											? "Upload"
											: "Uploaded"}
									</Fab>
								</label>
							</Grid>
						</Box>

						<Divider style={{ margin: "8px" }} light />

						<Button
							variant="contained"
							onClickCapture={() => handleSubmit()}
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

export default TrainingLogForm;
