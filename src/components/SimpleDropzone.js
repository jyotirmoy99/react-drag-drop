import React from "react";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { useHistory } from "react-router-dom";
import DropzoneComponent from "./DropzoneComponent";
import MaterialDropzone from "./MaterialDropzone";

function SimpleDropzone() {
  const history = useHistory();
  // const [image, setImage] = useState([]);

  const getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };

  const onChangeStatus = ({ meta }) => {
    console.log(meta);
  };

  const handleSubmit = (files) => {
    let arr = [];
    let img = files.map((f) => f.meta);
    arr.push(img);
    localStorage.setItem("image", JSON.stringify(arr[0]));
    let path = "/preview";
    history.push(path);
  };

  return (
    <div>
      <h3>react-dropzone-uploader</h3>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={onChangeStatus}
        onSubmit={handleSubmit}
        accept="image/*,audio/*,video/*,.pdf,.txt"
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
            // backgroundColor: "white",
            // borderColor: "black",
            width: 500,
            overflow: "hidden",
          },
          inputLabel: (files, extra) => (extra.reject ? { color: "red" } : {}),
        }}
      />
      <br />
      <br />
      <h3>material-ui-dropzone</h3>
      <MaterialDropzone />
      <br />
      <h3>react-dropzone</h3>
      <DropzoneComponent />
    </div>
  );
}

export default SimpleDropzone;

// allFiles.forEach((f) => f.remove());
// const reader = new FileReader();
// reader.onload = (e) => {
//   setImage(e.target.result);
// };
// reader.readAsDataURL(files[0].file);
