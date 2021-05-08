import React from "react";
import DropzoneComponent from "./components/DropzoneComponent";
import FileUploaderComponent from "./components/FileUploaderComponent";

import { BrowserRouter, Switch, Route } from "react-router-dom";

function Routes() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={DropzoneComponent} />
          <Route exact path="/FileUploader" component={FileUploaderComponent} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
