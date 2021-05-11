import React, { useMemo, useState, useEffect } from "react";
import "./DropzoneStyle.css";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";
// import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Close, CloudUpload } from "@material-ui/icons/";
import { IconButton } from "@material-ui/core";
import { FadeLoader } from "react-spinners";
import swal from "sweetalert";
import _ from "lodash";
import Progress from "./Progress";
const URLDATA = "http://3.7.47.235:8443/api/Containers/draggable/upload";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "30px",
  borderWidth: 3,
  borderRadius: 3,
  fontSize: "18px",
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

export default function DragAndDrop(props) {
  let [allFiles, setFile] = useState([]);
  const [draggedFiles, setDraggedFiles] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // const [arr, setArr] = useState([]);
  // const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".jpg, .jpeg, .png, .mp4, .mp3",
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setDraggedFiles(
        acceptedFiles.map((file) => {
          let files = allFiles;
          files.push(file);
          files = allFiles.filter(
            (value, index, arr) =>
              arr.findIndex((item) => item.name === value.name) === index
          );
          setFile(files);
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
    },
    onDropRejected: (fileRejections) => {
      if (fileRejections.length) {
        swal("Some files can not be accepted", {
          icon: "warning",
          closeOnClickOutside: false,
          closeOnEsc: false,
        }).then(function () {
          open();
        });
      }
    },
  });

  useEffect(() => {
    console.log(allFiles);
    if (draggedFiles.length > 0) {
      handleFileUpload();
    }
  }, [draggedFiles]);

  const cancelFileToUpload = (file) => {
    allFiles.splice(allFiles.indexOf(file), 1);
    setFile(allFiles);
    setDraggedFiles([...allFiles]);
  };

  //converting bytes
  function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  const Files = () => {
    return allFiles.map((file) => {
      return (
        <li key={file.path}>
          {file.path} - {bytesToSize(file.size)} bytes
          <IconButton
            color="secondary"
            aria-label="delete"
            onClick={() => cancelFileToUpload(file)}
          >
            <Close />
          </IconButton>
        </li>
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

  const [fileCount, setFileCount] = useState(0);

  const fileUploadQuery = (url, request) =>
    fetch(url, request)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.result && res.result.files) {
          if (res.result.files.ctscans.length) {
            const fileData = res.result.files.ctscans.map(
              (ctItem) => ctItem.name
            );
            return { fileData, error: null, apiCall: true };
          } else {
            return { fileData: [], error: null, apiCall: true };
          }
        } else {
          let message = res.error ? res.error.message : res.message;
          //   this.setState({
          //     open: true,
          //     severity: "error",
          //     alertmsg: message,
          //     uploading: false,
          //     isFileUpload: false,
          //     saveButtonDisabled: true,
          //     timer: 3000,
          //   });
          return { fileData: [], error: message, apiCall: true };
        }
      })
      .catch((error) => {
        // this.setState({
        //   open: true,
        //   severity: "error",
        //   alertmsg: error.message,
        //   uploading: false,
        //   isFileUpload: false,
        //   saveButtonDisabled: true,
        //   timer: 3000,
        // });
        return { fileData: [], error: error.message, apiCall: true };
      });

  const handleFileUpload = async (fileStatus = [], UploadedFile = []) => {
    //let { files } = this.state;
    console.log(allFiles);
    if (allFiles && allFiles.length) {
      let formData = new FormData();
      let batchfiles = _.chunk(allFiles, 20);
      let FileStatus = !fileStatus.length
        ? batchfiles.map((item) => {
            return { status: false, item };
          })
        : fileStatus;
      let uploadedFiles = UploadedFile;
      // if (signal.aborted) {
      //   controller = new AbortController();
      //   signal = controller.signal;
      // }
      var requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
        headers: {
          access_token: localStorage.getItem("token"),
        },
        onUploadProgress: (ProgressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );
          setTimeout(() => setUploadPercentage(0), 10000);
        },
        // signal: signal,
      };
      // this.setState({
      //   saveButtonDisabled: true,
      //   uploading: true,
      //   filename: [],
      // });
      setLoading(true);
      let uploadingFile = await Promise.all(
        batchfiles.map(async (batchItem, batchIndex) => {
          formData.delete("ctscans");
          let EachFile = await Promise.all(
            batchItem.map(async (fileItem, index, arr) => {
              if (arr.length === index + 1) {
                formData.append("ctscans", fileItem);
                if (
                  !FileStatus[batchIndex].status &&
                  (batchIndex === 0 ||
                    (FileStatus[batchIndex - 1] &&
                      FileStatus[batchIndex - 1].status === true))
                ) {
                  let queryData = await fileUploadQuery(
                    URLDATA,
                    requestOptions
                  );
                  FileStatus[batchIndex].status = queryData.apiCall
                    ? true
                    : false;
                  if (FileStatus[batchIndex].status) {
                    uploadedFiles = [...uploadedFiles, ...queryData.fileData];
                    setFileCount({ fileCount: uploadedFiles.length });
                    handleFileUpload(FileStatus, uploadedFiles);
                  }
                }
              } else {
                formData.append("ctscans", fileItem);
                return fileItem;
              }
            })
          );

          return batchItem;
        })
      );
      if (
        FileStatus.filter((item) => item.status).length === FileStatus.length
      ) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <CloudUpload style={{ color: "grey", fontSize: 40 }} />
        <p>Drag & drop files here...</p>
        <p>Or</p>
        <Button
          variant="outlined"
          style={{
            color: "#0071ce",
            border: "2px solid #0071ce",
            textTransform: "inherit",
          }}
          onClick={() => open()}
        >
          Browse File
        </Button>
        <br />

        {isLoading ? (
          <div className={`Loader Upload`}>
            {!fileCount && (
              <FadeLoader
                style={{ height: "15", width: "5", radius: "2" }}
                color={"#6FABF0"}
                loading={isLoading}
              />
            )}
            <div>
              {/* {console.log("File Counts", (fileCount / files) * 100)} */}
              {fileCount ? (
                <div>
                  <CircularProgress
                    value={
                      (fileCount / files.length) * 100
                      // (fileCount / files) * 100
                    }
                    className="uploadingLoader"
                  />
                  <Progress percentage={uploadPercentage} />
                  <h4>
                    {/* Uploaded {fileCount} out of {files.length} files */}
                  </h4>
                </div>
              ) : (
                <h4>Uploading...</h4>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {isLoading ? (
          <div className="Loader Upload">
            <FadeLoader
              style={{ height: "15", width: "5", radius: "2" }}
              color={"#6FABF0"}
              loading={isLoading}
            />
            <div>
              <h4
                style={{
                  marginTop: "20px",
                }}
              >
                Saving...
              </h4>
            </div>
          </div>
        ) : (
          <ul>
            <Files />
          </ul>
        )}
      </div>
    </div>
  );
}
