import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "react-circular-progressbar/dist/styles.css";
import {
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  List,
  ListItem,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@material-ui/core/";
// import { useHistory } from "react-router-dom";
import axios from "axios";
import { ApiUrl } from "./Service";

//***styling start***//
const baseStyle = {
  margin: "auto",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
  width: 500,
  cursor: "pointer",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
//***styling end***//

function DropzoneComponent(props) {
  // const history = useHistory();

  const [files, setFiles] = useState([]);
  const [saveFiles, setSaveFiles] = useState([]);
  const [progress, setProgress] = useState(false); //uploading
  const [loading, setLoading] = useState(false); //image loading
  const types = [
    ".jpg",
    ".jpeg",
    ".png",
    ".doc",
    ".docx",
    ".txt",
    ".xlsx",
    ".pdf",
    ".gif",
    ".mp4",
    ".mp3",
    ".svg",
    ".pptx",
    ".csv",
  ];

  useEffect(() => {
    console.log(saveFiles);
  }, [saveFiles]);

  const {
    getRootProps,
    getInputProps,
    open,
    isDragAccept,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: files || types,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      files.length > 0
        ? setSaveFiles(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          )
        : alert("Select file type to upload");
    },
  });

  const filess = acceptedFiles.map((file) => {
    return (
      <Grid container justify="center">
        <List key={file.path}>
          <ListItem>
            {file.path} - {file.type} - {file.size}bytes
          </ListItem>
        </List>
      </Grid>
    );
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const getFileTypes = (e) => {
    let types = files;
    let index = types.indexOf(e.target.value);
    if (index >= 0) {
      types.splice(index, 1);
    } else {
      types.push(e.target.value);
    }
    setFiles([...types]);
  };

  //handleSubmit

  const handleSubmit = () => {
    let formData = new FormData();
    setProgress(true);
    saveFiles.map((file) => {
      return formData.append("files", file);
    });
    axios.post(ApiUrl + "/upload", formData).then((res) => {
      console.log(res);
      if (res["data"].status === 200) {
        setTimeout(() => {
          setProgress(false);
        }, 1000);
        alert("File uploaded successfully");
      }
    });
  };

  return (
    <div className="container">
      <h2>Drag and Drop</h2>
      <br />
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div>Drag and Drop Files Here</div>
        <br />
        <br />
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => open()}
        >
          Choose
        </Button>
      </div>
      <Grid container justify="center">
        <FormGroup row>
          {types.map((type, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    color="primary"
                    onChange={getFileTypes}
                    value={type}
                  />
                }
                label={type}
              />
            );
          })}
        </FormGroup>
      </Grid>
      <div>{filess}</div>
      <br />
      <br />

      <br />
      {!progress ? (
        <Button
          size="large"
          variant="contained"
          color="primary"
          disabled={acceptedFiles.length === 0}
          onClick={handleSubmit}
        >
          Upload
        </Button>
      ) : (
        <CircularProgress value={progress} />
      )}
    </div>
  );
}

export default DropzoneComponent;
