import React from "react";
import { Typography } from "@material-ui/core";


  /*

  Sorting utilities for table headers

  */

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

  /*

  Date formatted to MMM(abbv.)/DD/YYYY

  */

export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const formattedDate = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
  return formattedDate;
};

  /*

  Time formatteed to HH:MM

  */

export const formatTime = (inputTime) => {
  const time = new Date(inputTime);
  const formattedTime = Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(time);
  return formattedTime;
};

  /*

  Designates the color of the indicator dots in priority fields.

  */

export const priorityColor = (priority) => {
  if (priority === "High") {
    return "error";
  } else if (priority === "Medium") {
    return "secondary";
  } else {
    return "primary";
  }
};

  /*

  Generate a unique UUID for session control

  */

export const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /*

  Generate the copyright footer with the current year

  */

 export const getQueryVariable = (variable) => {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) === variable) {
              return decodeURIComponent(pair[1]);
          }
      }
      return null;
  }

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Eastern District of New York | United States Bankruptcy Court{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
