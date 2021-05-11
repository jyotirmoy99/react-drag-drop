import React from "react";
import DropzoneComponent from "./components/DropzoneComponent";
import DragAndDrop from "./components/DragAndDrop";
import LargeFilesDragAndDrop from "./components/LargeFileDragAndDrop";

import { BrowserRouter, Switch, Route } from "react-router-dom";

function Routes() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={DropzoneComponent} />
          <Route exact path="/upload" component={DragAndDrop} />
          <Route exact path="/large" component={LargeFilesDragAndDrop} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
