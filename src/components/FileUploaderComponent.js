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

function FileUploaderComponent() {
  let [getAllFiles, setAllFiles] = useState([]);

  const [array, setArray] = useState([]);

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
            swal("Image uploaded successfully!", {
              icon: "success",
              closeOnClickOutside: false,
              closeOnEsc: false,
            });
            res.data.result.files.files.map((value) => {
              return array.push(value.name);
            });
            console.log(array);
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
  //
  //
  //
  //
  //
  //************DRAG AND DROP START***************/
  return (
    <div className="container">
      <h3>Upload Large File</h3>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here...</p>
        <Button variant="contained" color="secondary" onClick={() => open()}>
          Choose
        </Button>
      </div>

      {loading ? <CircularProgress variant="indeterminate" /> : null}
    </div>
  );
  //************DRAG AND DROP END***************/
}

export default FileUploaderComponent;
