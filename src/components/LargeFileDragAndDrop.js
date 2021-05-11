import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import axios from "axios";
import swal from "sweetalert";
import { Form } from "react-bootstrap";
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

function LargeFilesDragAndDrop() {
  const chunkSize = 1048576 * 3;
  const [showProgress, setShowProgress] = useState(false);
  const [counter, setCounter] = useState(1);
  const [fileToBeUpload, setFileToBeUpload] = useState({});
  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize);
  const [progress, setProgress] = useState(0);
  const [fileGuid, setFileGuid] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const progressInstance = (
    <ProgressBar animated now={progress} label={`${progress}%`} />
  );

  useEffect(() => {
    if (fileSize > 0) {
      fileUpload(counter);
    }
  }, [fileToBeUpload, progress]);

  const onDrop = useCallback((files) => {
    let zipFile = files;
    zipFile = files
      ? files.filter(
          (item) => item.type.includes("zip") && item.name.includes("zip")
        ).length
        ? files.filter(
            (item) => item.type.includes("zip") && item.name.includes("zip")
          )
        : files.filter(
            (item) =>
              !item.type.includes("rar") &&
              !item.name.includes("rar") &&
              !item.type.includes("msi") &&
              !item.name.includes("msi")
          )
      : files.filter(
          (item) =>
            !item.type.includes("rar") &&
            !item.name.includes("rar") &&
            !item.type.includes("msi") &&
            !item.name.includes("msi")
        );
    zipFile = zipFile.sort(function (a, b) {
      return a.name - b.name;
    });
    if (
      zipFile.filter(
        (item) => item.type.includes("zip") && item.name.includes("zip")
      ).length > 1
    ) {
      swal("Multiple zip files are not supported.", {
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
    } else {
      if (
        zipFile.filter(
          (item) => item.type.includes("zip") && item.name.includes("zip")
        ).length
      ) {
        getFileContext(zipFile);
      }
    }
  });

  const onDropRejected = (rejectedFiles) => {
    return (
      rejectedFiles &&
      rejectedFiles.length &&
      rejectedFiles[0].errors.map((item) => {
        if (item.code === "file-too-large")
          swal("File is too large. The maximum file size allowed is 1 GB.", {
            closeOnClickOutside: false,
            closeOnEsc: false,
          });
        else return null;
      })
    );
  };

  const Files = () => {
    return acceptedFiles.map((file) => {
      let size = (file.size / 1048576).toFixed(2);
      return (
        <li key={file.path} style={{ display: "inline" }}>
          {file.path} - {file.type} -{" "}
          {size > 0.0 ? size + " MB" : file.size + " Bytes"}
        </li>
      );
    });
  };

  const getFileContext = (files) => {
    resetChunkProperties();
    const _file = files[0];
    setFileSize(_file.size);
    const _totalCount =
      _file.size % chunkSize == 0
        ? _file.size / chunkSize
        : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
    setChunkCount(_totalCount);
    setFileToBeUpload(_file);
    const _fileID = uuidv4() + "." + _file.name.split(".").pop();
    setFileGuid(_fileID);
  };

  const resetChunkProperties = () => {
    setShowProgress(true);
    setProgress(0);
    setCounter(1);
    setBeginingOfTheChunk(0);
    setEndOfTheChunk(chunkSize);
  };

  const fileUpload = () => {
    setCounter(counter + 1);
    if (counter <= chunkCount) {
      var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
      uploadChunk(chunk);
    }
  };

  const uploadChunk = async (chunk) => {
    try {
      const response = await axios.post(URLDATA, chunk, {
        params: {
          id: counter,
          fileName: fileGuid,
        },
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      if (data.isSuccess) {
        setBeginingOfTheChunk(endOfTheChunk);
        setEndOfTheChunk(endOfTheChunk + chunkSize);
        if (counter == chunkCount) {
          console.log("Process is complete, counter", counter);
          await uploadCompleted();
        } else {
          var percentage = (counter / chunkCount) * 100;
          setProgress(percentage);
        }
      } else {
        console.log("Error Occurred:", data.errorMessage);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const uploadCompleted = async () => {
    var formData = new FormData();
    formData.append("fileName", fileGuid);
    const response = await axios.post(
      URLDATA,
      {},
      {
        params: {
          fileName: fileGuid,
        },
        data: formData,
      }
    );
    const data = response.data;
    if (data.isSuccess) {
      setProgress(100);
    }
  };

  const {
    getRootProps,
    getInputProps,
    open,
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".zip",
    noClick: true,
    noKeyboard: true,
    onDrop,
    onDropRejected,
    multiple: true,
    maxSize: 1073741824,
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

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here...</p>
        <p>or</p>
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
      </div>
      <ul style={{ listStyle: "none" }}>
        <Files />
      </ul>
      <Form.Group style={{ display: showProgress ? "block" : "none" }}>
        {progressInstance}
      </Form.Group>
    </div>
  );
}

export default LargeFilesDragAndDrop;
