import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-circular-progressbar/dist/styles.css";
import swal from "sweetalert";
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
  IconButton,
} from "@material-ui/core/";
import { Delete } from "@material-ui/icons/";
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

function DropzoneComponent() {
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
  const selectTypes = () => {
    return [
      { checked: true, type: ".jpg" },
      { checked: true, type: ".jpeg" },
      { checked: true, type: ".png" },
      { checked: true, type: ".pdf" },
      { checked: true, type: ".txt" },
      { checked: true, type: ".doc" },
      { checked: true, type: ".docx" },
      { checked: true, type: ".gif" },
      { checked: true, type: ".svg" },
      { checked: true, type: ".pptx" },
      { checked: true, type: ".zip" },
      { checked: true, type: ".rar" },
      { checked: true, type: ".xlsx" },
      { checked: true, type: ".csv" },
      { checked: true, type: ".m4a" },
      { checked: true, type: ".mp4" },
    ];
  };

  const [files, setFiles] = useState(types);
  const [saveFiles, setSaveFiles] = useState([]);
  const [loading, setLoading] = useState(false); //uploading
  const [load, setLoad] = useState(false); //choosing

  const {
    getRootProps,
    getInputProps,
    open,
    isDragAccept,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: files.filter((type) => type.checked).length
      ? files
          .filter((type) => type.checked)
          .map((type) => {
            return type.type;
          })
      : "",

    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setSaveFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
      }, 1000);
    },
    onDropRejected: (fileRejections) => {
      if (fileRejections.length) {
        swal("Upload only selected files", {
          icon: "warning",
          dangerMode: true,
          closeOnClickOutside: false,
          closeOnEsc: false,
        }).then(function () {
          open();
        });
      }
    },
  });

  //remove preview item

  const removeItem = (file) => {
    const newFiles = [...acceptedFilesItems]; // make a var for the new array
    acceptedFiles.splice(file, 1); // remove the file from the array
    setSaveFiles(newFiles);
    console.log(newFiles);
  };

  const acceptedFilesItems = acceptedFiles.map((file, i) => {
    return (
      <div>
        {!load ? (
          <Grid container justify="center">
            <List key={file.path}>
              <ListItem>
                <img
                  src={file.preview}
                  style={{ height: 80, width: 90 }}
                  alt=""
                />{" "}
                {file.path} - {file.size}bytes
                <IconButton
                  aria-label="delete"
                  style={{ color: "#c21515" }}
                  onClick={() => removeItem(i)}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            </List>
          </Grid>
        ) : (
          <LinearProgress value={load} />
        )}
      </div>
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

  const getFileTypes = (e, id) => {
    let allfiles = files;
    allfiles[id].checked = e;
    setFiles([...allfiles]);
  };

  //handleSubmit

  const handleSubmit = () => {
    let formData = new FormData();
    setLoading(true);
    saveFiles.map((file) => {
      return formData.append("file", file);
    });
    axios
      .post(ApiUrl + "/upload/multifileupload", formData)
      .then((res) => {
        console.log(res);
        if (res["data"].status === 200) {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          swal(res["data"].msg, {
            icon: "success",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        swal("Something went wrong", {
          icon: "error",
          dangerMode: true,
        });
      });
  };

  //checked all boxes
  const selectAll = () => {
    setFiles(selectTypes);
  };

  //unchecked all boxes
  const resetFilters = () => {
    setFiles(types);
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
      <div>{acceptedFilesItems}</div>
      <br />
      <br />
      <br />
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={() => selectAll()}
      >
        Select All
      </Button>{" "}
      <Button
        color="secondary"
        size="small"
        variant="contained"
        onClick={() => resetFilters()}
      >
        Reset
      </Button>
      <br />
      <br />
      <br />
      {!loading ? (
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
        <CircularProgress value={loading} />
      )}
      <br />
      <br />
      <br />
    </div>
  );
}

export default DropzoneComponent;
