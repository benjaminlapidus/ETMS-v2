import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Box,
	Grid,
	OutlinedInput,
	TextField,
	Divider,
	InputLabel,
	FormControl,
	Button,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { Alert, AlertTitle } from "@material-ui/lab";
import "date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
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

const FeaturedForm = (props) => {
	let { card } = props;

	const [firstLoad, setLoad] = useState(true);
	const [title, setTitle] = useState(card.title);
	const [location, setLocation] = useState(card.location);
	const [url, setUrl] = useState(card.url);
	const [description, setDescription] = useState(card.description);
	const [date, setDate] = React.useState(new Date(card.date));
	const [time, setTime] = React.useState(new Date(card.time));
	const [id, setId] = React.useState(card.id);
	const [error, setError] = useState("");

	const handleLocationChange = (event) => setLocation(event.target.value);
	const handleTitleChange = (event) => setTitle(event.target.value);
	const handleDescriptionChange = (event) =>
		setDescription(event.target.value);
	const handleUrlChange = (event) => setUrl(event.target.value);
	const handleTimeChange = (time) => setTime(time);
	const handleDateChange = (date) => setDate(date);

	function validateInput() {
		if (title === undefined || title === "") {
			setError("Invalid title");
			return false;
		}
		if (location === undefined || location === "") {
			setError("Invalid location");
			return false;
		}
		if (url === undefined || url === "") {
			setError("Invalid email address");
			return false;
		}
		if (!url.includes("@")) {
			setError("Email address missing @");
			return false;
		}
		return true;
	}

	async function postData(toInput) {
		const response = await fetch("/etms/api/addFeatured", {
			method: "POST",
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

	async function updateData(toInput) {
		const response = await fetch("/etms/api/updateFeatured", {
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
			title,
			location,
			url,
			description,
			date,
			time,
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
								value={title || ""}
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
								className={classes.title}
								shrink
								required
								htmlFor="standard-adornment-amount"
							>
								Location
							</InputLabel>
							<OutlinedInput
								value={location || ""}
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
								required
								htmlFor="standard-adornment-amount"
							>
								Contact Email
							</InputLabel>
							<OutlinedInput
								value={url || ""}
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
								Description
							</InputLabel>
							<TextField
								id="outlined-full-width"
								multiline
								rows={3}
								rowsMax={9}
								value={description || ""}
								onChange={handleDescriptionChange}
								style={{ margin: 0 }}
								helperText="255 character maximum"
								fullWidth
								margin="normal"
								color="secondary"
								variant="outlined"
							/>
						</FormControl>

						<Divider />

						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Box display="flex">
								<KeyboardDatePicker
									margin="normal"
									error={false}
									color="secondary"
									helperText="Date"
									value={date || ""}
									variant="dialog"
									onChange={handleDateChange}
								/>
								<KeyboardTimePicker
									variant="dialog"
									margin="normal"
									color="secondary"
									error={false}
									helperText="Time"
									value={time || ""}
									onChange={handleTimeChange}
								/>
							</Box>
						</MuiPickersUtilsProvider>

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

export default FeaturedForm;
