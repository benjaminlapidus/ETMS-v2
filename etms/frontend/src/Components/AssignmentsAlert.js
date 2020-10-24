import React, { useState } from "react";
import {
	Typography,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListSubheader,
	Divider,
	ListItemText,
	Tooltip,
	Button,
	Badge,
	Fab,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	Snackbar,
	Slide,
} from "@material-ui/core";
import { AssignmentLate, FiberManualRecord } from "@material-ui/icons";
import AssignmentDisplay from "./AssignmentDisplay";
import { FileService } from "./FileService.js";
import PublishIcon from "@material-ui/icons/Publish";
import { formatDate } from "./Utils";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		overflow: "auto",
		maxHeight: 400,
	},
	typographyStyles: {
		flex: 1,
	},
	horizontalLine: {
		margin: "32px",
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const priorityColor = (priority) => {
	if (priority === "High") {
		return "error";
	} else if (priority === "Medium") {
		return "secondary";
	} else {
		return "primary";
	}
};

export default function AssignmentsAlert(props) {
	const classes = useStyles();
	const [data, setData] = React.useState([]);
	const [firstLoad, setLoad] = React.useState(true);
	const [open, setOpen] = React.useState(false);
	const [card, setCard] = useState("");
	const [openSnackbar, setOpenSnackbar] = React.useState(false);
	const [attachment, setAttachment] = React.useState("Invalid File");
	const fileService = new FileService();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setAttachment("Invalid File");
		setLoad(true);
		setOpen(false);
	};

	const handleClickSnackbar = () => {
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackbar(false);
	};

	async function getData() {
		let response = await fetch("/etms/api/getAllAssignments"); //TODO: Update this to pass in username to pull tasks by username
		let body = await response.json();
		setData(body);
	}

	const handleUploadFile = (event) => {
		const data = new FormData();
		//using File API to get chosen file
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

	async function updateData(toInput) {
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
				id: toInput.id,
				assigner_username: toInput.assigner_username,
				username: toInput.username,
				title: toInput.title,
				status: toInput.status,
				due_date: toInput.due_date,
				date_completed: toInput.date_completed,
				priority: toInput.priority,
				url: toInput.url,
				attachment: attachment,
				notes: toInput.notes,
			}),
		});
		console.log(response);
		handleClickSnackbar();
		handleClose();
		setCard("");
	}

	const updateStates = () => {
		handleSubmit(
			card.id,
			card.assigner_username,
			card.username,
			card.title,
			"Pending",
			card.due_date,
			new Date(),
			card.priority,
			card.url,
			attachment,
			card.notes
		);
	};

	const handleSubmit = (
		id,
		assigner_username,
		username,
		title,
		status,
		due_date,
		date_completed,
		priority,
		url,
		attachment,
		notes
	) => {
		const toInput = {
			id,
			assigner_username,
			username,
			title,
			status,
			due_date,
			date_completed,
			priority,
			url,
			attachment,
			notes,
		};

		updateData(toInput);
	};

	if (firstLoad) {
		getData();
		setLoad(false);
	}

	return (
		<div>
			<Grid item container>
				<Grid item xs={5}>
					<Box style={{ display: "flex", maxWidth: 360 }}>
						<Typography
							className={classes.typographyStyles}
							variant="h5"
							color="textSecondary"
						>
							Assignments
						</Typography>
						<Badge
							color={data.length ? "secondary" : "primary"}
							badgeContent={
								data.filter(
									(assignment) =>
										assignment.status === "Incomplete" &&
										assignment.username ===
											atob(
												sessionStorage.getItem(
													"username"
												)
											)
								).length
							}
							overlap="rectangle"
							showZero
						>
							<AssignmentLate />
						</Badge>
					</Box>

					<List
						component="nav"
						className={classes.root}
						aria-label="contacts"
						subheader={
							<ListSubheader
								component="div"
								id="nested-list-subheader"
							>
								Incomplete Assignments
							</ListSubheader>
						}
					>
						{data?.map((card) =>
							card.status === "Incomplete" &&
							card.username ===
								atob(sessionStorage.getItem("username")) ? (
								<ListItem
									key={card.id}
									onClick={() => setCard(card)}
									button
								>
									<ListItemIcon>
										<Tooltip
											title={card.priority + " priority"}
										>
											<FiberManualRecord
												color={priorityColor(
													card.priority
												)}
											/>
										</Tooltip>
									</ListItemIcon>
									<ListItemText
										primary={card.title}
										secondary={
											"Due: " + formatDate(card.due_date)
										}
									/>
								</ListItem>
							) : null
						)}
					</List>
				</Grid>

				<Grid item xs={7}>
					<AssignmentDisplay card={card} access={"dashboard"} />
					{card.id ? (
						<Button
							onClick={handleClickOpen}
							variant="contained"
							fullWidth
							color="primary"
							style={{ marginTop: "8px" }}
							size="medium"
						>
							Complete
						</Button>
					) : null}
				</Grid>
			</Grid>

			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogContent>
					<DialogContentText color="textPrimary">
						Attachment
					</DialogContentText>
					<Box style={{ display: "flex" }}>
						<DialogContentText id="alert-dialog-slide-description">
							If applicable, please upload proof of assignment
							completion (e.g. certificate, picture, etc.)
						</DialogContentText>

						<Grid container justify="center" alignItems="center">
							<input
								style={{ display: "none" }}
								id="contained-button-file"
								multiple
								type="file"
								disabled={
									attachment === "Invalid File" ? false : true
								}
								onChange={handleUploadFile}
							/>
							<label htmlFor="contained-button-file">
								<Fab
									variant="extended"
									component="span"
									style={{
										backgroundColor:
											attachment === "Invalid File"
												? ""
												: "lime",
									}}
								>
									<PublishIcon />
									{attachment === "Invalid File"
										? "Upload"
										: "Uploaded"}
								</Fab>
							</label>
						</Grid>
					</Box>

					<Divider light style={{ margin: "16px" }} />
					<DialogContentText color="textPrimary">
						Confirmation
					</DialogContentText>
					<DialogContentText id="alert-dialog-slide-description">
						Updating this assignment status will update your
						supervisor and remove this entry from your incomplete
						assignments. Continue?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button
						onClick={updateStates}
						variant="contained"
						color="primary"
					>
						Complete
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={7500}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity="success"
					variant="filled"
				>
					Success! Don't forget to update your Training Log!
				</Alert>
			</Snackbar>
		</div>
	);
}
