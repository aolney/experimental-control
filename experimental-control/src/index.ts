import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import { INotebookTracker } from "@jupyterlab/notebook";

import $ from "jquery";

// Hide UI elements to effect lockdown
function lockdown() {
  const urlParams = new URLSearchParams(window.location.search);

  document.getElementById("jp-top-panel").style.display = "none";
  document.getElementById("jp-left-stack").style.display = "none";
  document.getElementById("jp-main-statusbar").style.display = "none";

  let mainPanelFirstChild = document.getElementById("jp-main-content-panel")
    .children[0];
  (mainPanelFirstChild as HTMLElement).style.display = "none";

  const timeout = urlParams.get("timeout");
  if (timeout && Number.parseInt(timeout) > 0) {
    setTimeout(() => {
      const user = getUrlUser();
      const hubLink =
        urlParams.get("hub") +
        "/" +
        user +
        "/" +
        urlParams.get("index") +
        "/" +
        urlParams.get("condition");

      document.body.innerHTML += `<div style="text-align:center;position:absolute;width:100%;height:100%;opacity:0.7;z-index:100;background:#000;">
      <h1 style="color:orange;opacity:1 !important;">
      <a target="_blank" rel="noopener noreferrer" href="${hubLink}">Click here to get your next assignment</a>
      </h1>
      </div>`;
    }, Number.parseInt(timeout));
  }
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
      // Remove 'x' icon from tab and Launcher tab here since we need app context
      app.restored.then(() => {
        setInterval(function () {
          $(".p-TabBar-tabCloseIcon").remove();
          $(".p-TabBar-tab").each(function (idx) {
            if ($(this)[0].innerText.includes("Launcher")) {
              $(this).remove();
            }
          });
        }, 1000);
      });

      notebooks.currentChanged.connect(lockdown, null);
    }
  },
};

export default extension;
