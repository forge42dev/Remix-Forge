# Remix Forge

Remix Forge - A VS Code extension for generating route files for Remix.run applications.

## Whats new?

- Added ability to convert v1 route convention to v2 route convention
- Added ability to change runtime dependencies

## Features

### Route File Generation
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

### Routing Convention Conversion

Converts the v1 routing convention to the v2 routing convention.
This command will try to convert your routes from v1 to v2 and if anything goes wrong it will restore your routes to initial state. 
Just in case PLEASE make sure you have a backup in case something unexpected happens or you find a bug. In case of a bug
feel free to submit an issue on our Github repository.

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
* `remix-forge.runtimeDependency`: Allows you to change the output for the runtime dependencies (`default is ''`).

## Roadmap

- [x] Add ability to convert v1 route convention to v2 route convention
- [x] Add ability to change runtime dependencies
- [ ] Add ability for the extension to sniff out the runtime dependency instead of you configuring it
- [ ] Add ability to generate a component name based on the route name
- [ ] Add ability to generate fully progressive forms with validation
- [ ] Add ability to generate authenticated routes via actions

## Release Notes 

### 0.0.4

- Ability to convert v1 route convention to v2 route convention
- Updated readme
- Moved the commands to a separate context menu section
- Ability to change runtime dependencies

### 0.0.3

Readme update

### 0.0.2

Readme update

### 0.0.1

Initial release of Remix Forge
 


 

  
