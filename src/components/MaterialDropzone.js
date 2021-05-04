import React, { useState } from "react";
import { DropzoneArea } from "material-ui-dropzone";

function MaterialDropzone() {
  const [files, setFiles] = useState([]);

  const handleChange = (file) => {
    setFiles(file);
    console.log(file);
  };
  return (
    <div>
      <DropzoneArea onChange={handleChange} value={files} />
    </div>
  );
}

export default MaterialDropzone;
