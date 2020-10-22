import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import {
  INotebookTracker
} from '@jupyterlab/notebook';

// Hide UI elements to effect lockdown
function lockdown() {

    document.getElementById("jp-top-panel").style.display = "none";
    document.getElementById("jp-left-stack").style.display = "none";

    let mainPanelFirstChild = document.getElementById("jp-main-content-panel").children[0];
    (mainPanelFirstChild as HTMLElement).style.display = "none";

  }

/**
 * Initialization data for the experimental-control extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "experimental-control",
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebooks: INotebookTracker) => {
    const urlParams = new URLSearchParams(window.location.search);
    const lockParam = urlParams.get("lock");
    if (lockParam === "1") {
      console.log("JupyterLab extension experimental-control is activated!");
      notebooks.currentChanged.connect( lockdown, null)
    }
  }
};

export default extension;
