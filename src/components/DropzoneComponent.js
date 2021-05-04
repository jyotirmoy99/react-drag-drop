import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@material-ui/core/";
import { useHistory } from "react-router-dom";
// import axios from "axios";

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
  width: 400,
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
  const history = useHistory();

  const [files, setFiles] = useState([]);
  const [saveFiles, setSaveFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, accept: "image/jpeg, image/png" });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img
        src={file.preview}
        alt={file.name}
        style={{ height: 100, width: 150 }}
      />
    </div>
  ));

  //   useEffect(() => {
  //     files.forEach((file) => URL.revokeObjectURL(file.preview));
  //   }, [files]);

  //handleSubmit
  const handleSubmit = () => {
    console.log(files);
    saveFiles.push(files);
    localStorage.setItem("files", JSON.stringify(saveFiles));
    let path = "/preview2";
    history.push(path);
  };

  return (
    <section>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div>Drag and Drop Images Here</div>
      </div>
      <aside>{thumbs}</aside>
      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <br />
      <br />
      <br />
      <br />
    </section>
  );
}

export default DropzoneComponent;
