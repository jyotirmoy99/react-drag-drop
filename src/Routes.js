import React from "react";
import SimpleDropzone from "./components/SimpleDropzone";
import ImagePreview from "./components/ImagePreview";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import FilePreview from "./components/FilePreview";

function Routes() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SimpleDropzone} />
          <Route exact path="/preview" component={ImagePreview} />
          <Route exact path="/preview2" component={FilePreview} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
