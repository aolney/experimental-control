import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import { INotebookTracker } from "@jupyterlab/notebook";

const BASE_HUB_URL = "localhost:3000";

// Hide UI elements to effect lockdown
function lockdown() {
  const urlParams = new URLSearchParams(window.location.search);

  document.getElementById("jp-top-panel").style.display = "none";
  document.getElementById("jp-left-stack").style.display = "none";
  document.getElementById("jp-main-statusbar").style.display = "none";

  let mainPanelFirstChild = document.getElementById("jp-main-content-panel")
    .children[0];
  (mainPanelFirstChild as HTMLElement).style.display = "none";

  setTimeout(() => {
    const user = getUrlUser();
    const index = urlParams.get("index");
    const hubLink = BASE_HUB_URL + "/" + user + "/" + index;

    document.body.innerHTML += `<div style="text-align:center;position:absolute;width:100%;height:100%;opacity:0.7;z-index:100;background:#000;">
      <h1 style="color:orange;opacity:1 !important;">
      <a target="_blank" rel="noopener noreferrer" href="${hubLink}">Click here to get your next assignment</a>
      </h1>
      </div>`;
  }, Number.parseInt(urlParams.get("timeout")));
}

function getUrlUser() {
  let pathArray = window.location.pathname.split("/");
  let userPathIndex = 0;
  pathArray.forEach((path, index) => {
    if (path === "user") {
      userPathIndex = index + 1;
    }
  });
  return pathArray[userPathIndex];
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
      notebooks.currentChanged.connect(lockdown, null);
    }
  },
};

export default extension;
