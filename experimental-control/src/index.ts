import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  LabShell,
} from "@jupyterlab/application";
import { INotebookTracker, NotebookPanel } from "@jupyterlab/notebook";
import $ from "jquery";
import { MarkdownCellModel } from "@jupyterlab/cells";

const viewWeTitle = "Click here to open the worked example";
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

let isInternalLinkGenerated = false;

// Hide UI elements to effect lockdown
function lockdown(this: LabShell) {
  //try to collapse left navbar again. It seems sometimes a delayed workspace load will pop it out agains
  this.collapseLeft();

  document.getElementById("jp-top-panel").style.display = "none";
  document.getElementById("jp-left-stack").style.display = "none";
  document.getElementById("jp-main-statusbar").style.display = "none";

  let mainPanelFirstChild = document.getElementById("jp-main-content-panel")
    .children[0];
  (mainPanelFirstChild as HTMLElement).style.display = "none";
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
 *
 * @param notebook
 * Remove external link from worked example since it's
 * only available for reference
 */
const clearExternalLink = (notebook: NotebookPanel) => {
  const notebookModel = notebook.model;
  const lastCell = notebookModel.cells.get(notebookModel.cells.length - 1);
  if (lastCell.id.includes("external")) {
    console.log("Clearing unused worked example external link.");
  }
};

const generateLinks = (notebooks: INotebookTracker) => {
  const notebook = notebooks.currentWidget;
  const notebookModel = notebook.model;
  const title = notebook.title.label;

  let link = "";
  let doesInternalLinkExist = false;

  try {
    doesInternalLinkExist = notebookModel.cells
      .get(0)
      .toJSON()
      .source[0].includes(viewWeTitle);
  } catch (err) {
    console.log(err);
  }

  if (
    title.includes("ps-near1") &&
    !doesInternalLinkExist &&
    !isInternalLinkGenerated
  ) {
    notebooks.forEach((notebook) => {
      if (notebook.title.label.includes("we-")) {
        clearExternalLink(notebook);
      }
    });
    if (title.includes("-gl")) {
      if (Number.parseInt(urlParams.get("bl")) === 1) {
        link = `[${viewWeTitle}](we-bl-gl.ipynb)`;
      } else {
        link = `[${viewWeTitle}](we-co-gl.ipynb)`;
      }
    }
    if (title.includes("-na")) {
      if (Number.parseInt(urlParams.get("bl")) === 1) {
        link = `[${viewWeTitle}](we-bl-na.ipynb)`;
      } else {
        link = `[${viewWeTitle}](we-co-na.ipynb)`;
      }
    }
    const markdownModel = new MarkdownCellModel({
      cell: {
        cell_type: "markdown",
        source: [link],
        metadata: {
          deletable: false,
          editable: false,
        },
        id: "internal-we",
      },
    });

    notebookModel.cells.insert(0, markdownModel);
    isInternalLinkGenerated = true;
  }

  if (!$("#external-link").length) {
    const $link = $("<a>", {
      id: "external-link",
      css: {
        color: "#64b5f6",
      },
    });
    $link.text(
      "Click here after you've finished to move to the next assignment"
    );
    $link.on("click", function () {
      window.location.replace(hubLink);
    });
    const $notebook = $(".jp-NotebookPanel-notebook");
    $notebook.append($link);
  }
};

// };
/**
 * Initialization data for the experimental-control extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "experimental-control",
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebooks: INotebookTracker) => {
    window.addEventListener("beforeunload", function (event) {
      console.log("UNLOAD:1");
    });
    const urlParams = new URLSearchParams(window.location.search);
    const lockParam = urlParams.get("lock");

    notebooks.currentChanged.connect(() => {
      notebooks.currentWidget.context.ready.then(() => {
        generateLinks(notebooks);
      });
    });

    if (lockParam === "1") {
      console.log("JupyterLab extension experimental-control is activated!");
      // Remove 'x' icon from tab and Launcher tab here since we need app context
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
              !($innerText.includes("we-") || $innerText.includes("near1")) ||
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
