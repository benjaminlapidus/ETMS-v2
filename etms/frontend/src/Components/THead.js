import React from "react";
import {
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel,
} from "@material-ui/core";

export default function THead(props) {
	const { order, orderBy, createSortHandler, headCells } = props;

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox" />
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "default"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? <span></span> : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
