import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

/**
 * Initialization data for the experimental-control extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "experimental-control",
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const lockParam = urlParams.get("lock");
      if (lockParam === "1") {
        document.getElementById("jp-top-panel").style.display = "none";
        document.getElementById("jp-left-stack").style.display = "none";

        let mainPanelFirstChild = document.getElementById(
          "jp-main-content-panel"
        ).children[0];
        (mainPanelFirstChild as HTMLElement).style.display = "none";
      }
    }, 1000);
    console.log("JupyterLab extension experimental-control is activated!");
  },
};

export default extension;
