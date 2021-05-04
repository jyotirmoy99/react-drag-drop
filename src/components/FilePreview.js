import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
// import { Delete } from "@material-ui/icons/";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function FilePreview() {
  const classes = useStyles();
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    getLocalData();
  }, [imageData]);

  const getLocalData = () => {
    let local = JSON.parse(localStorage.getItem("files"));
    setImageData(local[0]);
  };

  //delete Image
  //   const deleteImage = (id) => {
  //     // setImageData(imageData.splice(id, 1));
  //     // localStorage.setItem("image", JSON.stringify(imageData));
  //     const newData = imageData.filter((item) => item.id !== id);
  //     setImageData(newData);
  //     localStorage.setItem("image", JSON.stringify(newData));
  //   };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {imageData.length > 0 ? (
              imageData.map((value) => {
                return (
                  <TableRow>
                    <TableCell>{value.path}</TableCell>
                    <TableCell>
                      <img
                        src={value.preview}
                        style={{ height: 200, width: 200 }}
                        alt=""
                      />
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<Delete />}
                        onClick={() => deleteImage(value.id)}
                      >
                        Delete
                      </Button>
                    </TableCell> */}
                  </TableRow>
                );
              })
            ) : (
              <h3>No image</h3>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default FilePreview;
