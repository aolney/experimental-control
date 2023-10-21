# experimental-control

![Github Actions Status](https://github.com/aolney/experimental-control/workflows/Build/badge.svg)

DataWhys JupyterLab experimental control extension. To enable:

- Install the extension (see below)
- Append `lock=1` to the URL query string

If the query string parameter is not set, the extension will not be active.

The following behaviors are implemented:

- Left navbar collapsed (e.g. file explorer)
- Left navbar hidden
- Launcher and terminal tabs hidden
- Notebook tab close button disabled
- Bottom status bar hidden
- Auto renders markdown in case users accidentally double click
- For WE/PS1, checks the expected number of code cells have been executed before giving password


## Requirements

* JupyterLab >= 1.0

## Install

```bash
jupyter labextension install experimental-control
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to experimental-control directory
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

### Uninstall

```bash
jupyter labextension uninstall experimental-control
```

