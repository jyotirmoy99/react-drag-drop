import React from "react";
import SimpleDropzone from "./components/SimpleDropzone";
import ImagePreview from "./components/ImagePreview";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import FilePreview from "./components/FilePreview";
import DropzoneComponent from "./components/DropzoneComponent";
import MaterialDropzone from "./components/MaterialDropzone";

function Routes() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/rdu" component={SimpleDropzone} />
          <Route exact path="/" component={DropzoneComponent} />
          <Route exact path="/mui" component={MaterialDropzone} />
          <Route exact path="/preview" component={ImagePreview} />
          <Route exact path="/preview2" component={FilePreview} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
