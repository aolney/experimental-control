import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  LabShell,
} from "@jupyterlab/application";
import {
  INotebookTracker,
  NotebookPanel,
  INotebookModel,
} from "@jupyterlab/notebook";
import { IDisposable, DisposableDelegate } from "@phosphor/disposable";
import { ToolbarButton } from "@jupyterlab/apputils";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import $ from "jquery";

const urlParams = new URLSearchParams(window.location.search);
const user = getUrlUser();
const hubLink =
  urlParams.get("hub") +
  "/" +
  user +
  "/" +
  urlParams.get("index") +
  "/" +
  urlParams.get("condition");

// Hide UI elements to effect lockdown
function lockdown(this: LabShell, notebookTracker: any, notebookPanel: any) {
  //try to collapse left navbar again. It seems sometimes a delayed workspace load will pop it out again
  this.collapseLeft();

  document.getElementById("jp-top-panel").style.display = "none";
  document.getElementById("jp-left-stack").style.display = "none";
  document.getElementById("jp-main-statusbar").style.display = "none";

  let mainPanelFirstChild = document.getElementById("jp-main-content-panel")
    .children[0];
  (mainPanelFirstChild as HTMLElement).style.display = "none";

  const timeout = urlParams.get("timeout");
  if (timeout && Number.parseInt(timeout) > 0) {
    setTimeout(() => {
      document.body.innerHTML += `<div style="text-align:center;position:absolute;width:100%;height:100%;opacity:1;z-index:100;background:#000;">
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

class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    let callback = () => {
      // Return to DW client
      window.location.href = hubLink;
    };
    let button = new ToolbarButton({
      className: "backToClientBtn",
      label: "I'm finished with my assignment",
      onClick: callback,
      tooltip: "Submit assignment and return to DataWhys hub.",
    });

    panel.toolbar.insertItem(0, "runAll", button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
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
      app.docRegistry.addWidgetExtension("Notebook", new ButtonExtension());
      app.restored.then(() => {
        //collapse the file explorer and anything else on the left navbar
        (app.shell as LabShell).collapseLeft();

        //Wes: why set a timer here; why not wait for currentChanged as below?
        setInterval(function () {
          $(".p-TabBar-tabCloseIcon").hide();
          let workedExampleEligible = true;
          $(".p-TabBar-tab").each(function (idx) {
            let $currentTabParent = $(this);
            let $currentTab = $currentTabParent[0];
            let $innerText = $currentTab.innerText;
            if ($innerText.includes("near2") || $innerText.includes("far")) {
              workedExampleEligible = false;
            }
          });

          $(".p-TabBar-tab").each(function (idx) {
            let $currentTabParent = $(this);
            let $currentTab = $currentTabParent[0];
            let $innerText = $currentTab.innerText;
            if (
              !($innerText.includes("we-") && $innerText.includes("near1")) ||
              !workedExampleEligible
            ) {
              $currentTabParent.hide();
            }
          });
        }, 1000);
      });

      notebooks.currentChanged.connect(lockdown, app.shell);
    }
  },
};

export default extension;
