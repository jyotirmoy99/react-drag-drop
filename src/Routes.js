import React from "react";
import DropzoneComponent from "./components/DropzoneComponent";
import DragAndDrop from "./components/DragAndDrop";

import { BrowserRouter, Switch, Route } from "react-router-dom";

function Routes() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={DropzoneComponent} />
          <Route exact path="/upload" component={DragAndDrop} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
