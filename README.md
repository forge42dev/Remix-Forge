# Remix Forge

Remix Forge - A VS Code extension for generating route files for Remix.run applications.

## Features

Generates every possible export from a route file for Remix.run applications.
Including:
- `dependencies`
- `loader function`
- `links function`
- `ErrorBoundary component`
- `default Component`
- `shouldRevalidate function`
- `meta function`
- `action function`
- `headers function`
- `handle function`
 

> Tip: This is highly configurable per workspace. See the [Extension Settings](#extension-settings) section on how you can customize your output

## Usage

Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/basic-demo.mp4" controls="controls" style="max-width: 730px;">
</video>

## Extension Settings 

This extension contributes the following configuration settings:

* `remix-forge.preselected`: Array of preselected options after clicking the Generate Remix route (`default is []`).
* `remix-forge.orderOfGeneration`: Allows you to change the order of generation, eg: ["loader", "action"] (`default is []`).
* `remix-forge.loader`: Allows you to change the output for the loader segment of the code (`default is ''`).
* `remix-forge.action`: Allows you to change the output for the action segment of the code (`default is ''`).
* `remix-forge.meta`: Allows you to change the output for the meta segment of the code (`default is ''`).
* `remix-forge.handle`: Allows you to change the output for the handle segment of the code (`default is ''`).
* `remix-forge.component`: Allows you to change the output for the component segment of the code (`default is ''`).
* `remix-forge.links`: Allows you to change the output for the links segment of the code (`default is ''`).
* `remix-forge.errorBoundary`: Allows you to change the output for the ErrorBoundary segment of the code (`default is ''`).
* `remix-forge.revalidate`: Allows you to change the output for the revalidate segment of the code (`default is ''`).
* `remix-forge.headers`: Allows you to change the output for the headers segment of the code (`default is ''`).

## Release Notes 

### 0.0.1

Initial release of Remix Forge
 
### 0.0.2

Readme update

### 0.0.3

Readme update
 

  
