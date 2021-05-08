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
  IconButton,
} from "@material-ui/core/";
import { Delete, CloudUpload } from "@material-ui/icons/";
import axios from "axios";
// import { ApiUrl } from "../Service";

//***styling start***//
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "50px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
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
  let [getAllFiles, setAllFiles] = useState([]);

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
  const [loading, setLoading] = useState(false); //uploading

  const {
    getRootProps,
    getInputProps,
    open,
    isDragAccept,
    isDragActive,
    isDragReject,
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
        acceptedFiles.map((file) => {
          let files = getAllFiles;
          files.push(file);
          files = getAllFiles.filter(
            (value, index, arr) =>
              arr.findIndex((item) => item.name === value.name) === index
          );
          setAllFiles(files);
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
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
    getAllFiles.splice(getAllFiles.indexOf(file), 1);
    setAllFiles(getAllFiles);
    setSaveFiles([...getAllFiles]);
  };

  const AcceptedFilesItems = () => {
    return getAllFiles.map((file) => {
      return (
        <div>
          {
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
                    style={{ color: "#ff0000" }}
                    onClick={() => removeItem(file)}
                  >
                    <Delete />
                  </IconButton>
                </ListItem>
              </List>
            </Grid>
          }
        </div>
      );
    });
  };

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

  //***********UPLOAD FILE TO SERVER START********************/
  const handleSubmit = () => {
    if (getAllFiles.length === 0) {
      swal("No files are selected", {
        icon: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
      return false;
    }
    if (navigator.onLine) {
      setLoading(true);
      let formData = new FormData();
      getAllFiles.map((file) => {
        return formData.append("files", file);
      });
      axios
        .post(
          "http://3.7.47.235:8443/api/Containers/draggable/upload",
          formData
        )
        .then((res) => {
          setLoading(false);
          if (res && res.status === 200) {
            swal("Image uploaded successfully!", {
              icon: "success",
              closeOnClickOutside: false,
              closeOnEsc: false,
            });
            setAllFiles([]);
          } else {
            swal("Error occured while uploading", {
              icon: "warning",
              closeOnClickOutside: false,
              closeOnEsc: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          swal("Something went wrong", {
            icon: "error",
            closeOnClickOutside: false,
            closeOnEsc: false,
          });
        });
    } else {
      swal("No internet connection", {
        icon: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
    }
  };
  //***********UPLOAD FILE TO SERVER END********************/

  //unchecked all boxes
  const resetFilters = () => {
    setFiles(types);
  };

  //checked all boxes
  const selectAll = (checked) => {
    let arr = files;
    arr.forEach((item) => {
      item.checked = checked;
      setFiles([...arr]);
    });
  };

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here...</p>
        <Button variant="contained" color="secondary" onClick={() => open()}>
          Choose
        </Button>
      </div>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              color="secondary"
              onChange={(event) => selectAll(event.target.checked)}
            />
          }
          label="Select all"
        />
        {files.map((type, index) => {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={type.checked}
                  color="secondary"
                  onChange={(evt) => getFileTypes(evt.target.checked, index)}
                  value={type.type}
                />
              }
              label={type.type}
            />
          );
        })}
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => resetFilters()}
        >
          Reset
        </Button>
      </FormGroup>
      <ul style={{ listStyle: "none" }}>
        <AcceptedFilesItems />
      </ul>
      {loading ? <CircularProgress variant="indeterminate" /> : null}
      <Button
        onClick={() => handleSubmit()}
        variant="contained"
        color="secondary"
        disabled={getAllFiles.length === 0 || loading}
        endIcon={<CloudUpload />}
      >
        Upload
      </Button>
    </div>
  );
}

export default DropzoneComponent;
