import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-circular-progressbar/dist/styles.css";
import swal from "sweetalert";
import {
  Button,
  List,
  ListItem,
  Grid,
  CircularProgress,
  IconButton,
} from "@material-ui/core/";
import { Close, CloudUpload } from "@material-ui/icons/";
import axios from "axios";

import "./patients.css";
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
  borderColor: "#0071ce",
  borderStyle: "dashed",
  backgroundColor: "#e9f5ff",
  color: "#000",
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

function FileUploaderComponent() {
  let [getAllFiles, setAllFiles] = useState([]);

  const [array, setArray] = useState([]);

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
      handleSubmit();
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

  const removeItem = (file) => {
    getAllFiles.splice(getAllFiles.indexOf(file), 1);
    setAllFiles(getAllFiles);
    setSaveFiles([...getAllFiles]);
    console.log(getAllFiles);
  };

  const AcceptedFilesItems = () => {
    return getAllFiles.map((file) => {
      return (
        <div>
          {
            <Grid container justify="center">
              <List>
                <ListItem style={{ color: "black", alignItems: "left" }}>
                  {file.name} - {file.size}bytes
                  <IconButton
                    aria-label="delete"
                    style={{ color: "#ff0000" }}
                    onClick={() => removeItem(file)}
                  >
                    <Close />
                  </IconButton>
                </ListItem>
              </List>
            </Grid>
          }
        </div>
      );
    });
  };

  //
  //
  //
  //
  //
  //**********STYLE CONDITION START***********/
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  //**********STYLE CONDITION END***********/
  //
  //
  //
  //
  //
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
            // swal("Image uploaded successfully!", {
            //   icon: "success",
            //   closeOnClickOutside: false,
            //   closeOnEsc: false,
            // });
            res.data.result.files.files.map((value) => {
              return array.push(value.name);
            });
            console.log(array);
            // setAllFiles([]);
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
  //
  //
  //
  //
  //
  //************DRAG AND DROP START***************/
  return (
    <div className="container patients">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>
          <CloudUpload style={{ color: "grey" }} />
        </p>
        <p>Drag and drop files here</p>
        <p>or</p>
        <Button
          variant="outlined"
          style={{ color: "#0071ce", border: "2px solid #0071ce" }}
          size="small"
          onClick={() => open()}
        >
          Browse File
        </Button>
        <br />
        <AcceptedFilesItems />
      </div>

      {loading ? <CircularProgress variant="indeterminate" /> : null}
    </div>
  );
  //************DRAG AND DROP END***************/
}

export default FileUploaderComponent;
