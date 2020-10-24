import React, { Component } from "react";
import { FileService } from "./FileService.js";
import { Grid, Fab } from "@material-ui/core";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

export default function FileUploader() {
  const fileService = new FileService();
  const [uploadMessage, setUploadMessage] = React.useState("Upload File");
  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleUploadFile = (event) => {
    const data = new FormData();
    //using File API to get chosen file
    data.append("file", event.target.files[0]);
    data.append("name", "my_file");
    //calling async Promise and handling response or error situation
    fileService
      .uploadFileToServer(data)
      .then((response) => {
        console.log(response.data.fileDownloadUri);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <Grid container justify="center" alignItems="center">
        <input
          style={{ display: "none" }}
          id="contained-button-file"
          multiple
          disabled={isDisabled}
          type="file"
          onChange={handleUploadFile}
        />
        <label htmlFor="contained-button-file">
          <Fab disabled={isDisabled} variant="extended" component="span">
            <AddPhotoAlternateIcon />
            {uploadMessage}
          </Fab>
        </label>
      </Grid>
    </div>
  );
}
