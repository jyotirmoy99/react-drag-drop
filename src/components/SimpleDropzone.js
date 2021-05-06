import React, { useState } from "react";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
// import { useHistory } from "react-router-dom";
import axios from "axios";
import { ApiUrl } from "./Service";

//Material UI
import {
  Button,
  Checkbox,
  Grid,
  FormControlLabel,
  FormGroup,
  // CircularProgress,
} from "@material-ui/core/";

function SimpleDropzone() {
  // const history = useHistory();

  const types = () => {
    return [
      { checked: false, type: ".jpg" },
      { checked: false, type: ".jpeg" },
      { checked: false, type: ".png" },
      { checked: false, type: ".pdf" },
      { checked: false, type: ".txt" },
      { checked: false, type: ".doc" },
      { checked: false, type: ".docx" },
      { checked: false, type: ".gif" },
      { checked: false, type: ".svg" },
      { checked: false, type: ".pptx" },
      { checked: false, type: ".zip" },
      { checked: false, type: ".rar" },
      { checked: false, type: ".xlsx" },
      { checked: false, type: ".csv" },
      { checked: false, type: ".m4a" },
      { checked: false, type: ".mp4" },
    ];
  };

  const [files, setFiles] = useState(types);
  const [saveFiles, setSaveFiles] = useState([]);
  // const [loading, setLoading] = useState(false); //uploading

  const getUploadParams = ({ file }) => {
    const body = new FormData();
    body.append("file", file);
    return { url: ApiUrl + "/upload/multifileupload", body };
  };

  const handleChangeStatus = ({ xhr }) => {
    if (xhr) {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const result = JSON.parse(xhr.response);
          console.log(result);
        }
      };
    }
  };

  const getFileTypes = (e, id) => {
    let allfiles = files;
    allfiles[id].checked = e;
    setFiles([...allfiles]);
  };

  //uploading
  // const handleSubmit = (files) => {
  //   console.log(files.map((f) => f.meta));
  // };

  //reset filters
  const resetFilters = () => {
    setFiles(types);
  };

  return (
    <div>
      <h3>react-dropzone-uploader</h3>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        // onSubmit={handleSubmit}
        accept={
          files.filter((type) => type.checked).length
            ? files
                .filter((type) => type.checked)
                .map((type) => {
                  return type.type;
                })
            : ""
        }
        inputContent={(files, extra) =>
          extra.reject
            ? "Only image, audio and video files allowed"
            : "Drag and Drop files"
        }
        styles={{
          dropzoneReject: {
            borderColor: "violet",
            backgroundColor: "lightcyan",
          },
          dropzone: {
            width: 500,
            overflow: "hidden",
          },
          inputLabel: (files, extra) => (extra.reject ? { color: "red" } : {}),
        }}
      />
      <br />
      <Grid container justify="center">
        <FormGroup row>
          {files.map((type, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={type.checked}
                    color="primary"
                    onChange={(e) => getFileTypes(e.target.checked, index)}
                    value={type.type}
                  />
                }
                label={type.type}
              />
            );
          })}
        </FormGroup>
      </Grid>
      <br />
      <Button
        color="secondary"
        size="large"
        variant="contained"
        onClick={() => resetFilters()}
      >
        Reset
      </Button>
    </div>
  );
}

export default SimpleDropzone;
