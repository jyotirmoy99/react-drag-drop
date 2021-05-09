// import React, {
//   Component,
//   useCallback,
//   useMemo,
//   useState,
//   useEffect,
// } from "react";
// import {
//   FormHelperText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   IconButton,
// } from "@material-ui/core";
// import { useDropzone } from "react-dropzone";
// import CloseIcon from "@material-ui/icons/Close";
// import axios from "axios";
// import { ProgressBar } from "react-bootstrap";

// function FileUploader(props) {
//   const [showProgress, setShowProgress] = useState(false);
//   const [progress, setProgress] = useState(0); //loader
//   const activeStyle = {
//     backgroundColor: "#79B3C6",
//   };
//   let {
//     getRootProps,
//     getInputProps,
//     open,
//     acceptedFiles,
//     fileRejections,
//     isDragActive,
//     isDragAccept,
//     isDragReject,
//   } = useDropzone({
//     // Disable click and keydown behavior
//     noClick: true,
//     noKeyboard: true,
//     onDrop,
//     onDropRejected,
//     multiple: true,
//     maxSize: 1073741824,
//   });

//   const style = useMemo(
//     () => ({
//       ...(isDragActive ? activeStyle : {}),
//     }),
//     [isDragActive, isDragReject, isDragAccept]
//   );
//   const progressInstance = (
//     <ProgressBar now={progress} label={`${progress.toFixed(3)}%`} />
//   );
//   return (
//     <div className="container">
//       <div {...getRootProps({ className: "dropzone", style })}>
//         <input {...getInputProps()} />
//         {/* <img src={cloudUploadIcon} /> */}
//         <p>Drag & Drop file here</p>
//         <p>or</p>
//         <Button onClick={open} disabled={showProgress}>
//           Browse File
//         </Button>
//         {files.length && !props.removeAllFile && !showProgress ? (
//           <div className="fileContainer">
//             <ul>{files}</ul>
//           </div>
//         ) : (
//           ""
//         )}
//         <div
//           style={{ display: showProgress ? "block" : "none" }}
//           className="progressStyle"
//         >
//           {progressInstance}
//         </div>
//         {/* {fileRejectionItems.length ? (
//         <div className="fileContainer">
//           <ul>{fileRejectionItems}</ul>
//         </div>
//       ) : (
//         ""
//       )} */}
//       </div>
//     </div>
//   );
// }

// export default FileUploader;
