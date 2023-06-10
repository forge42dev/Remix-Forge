# Remix Forge

Remix Forge - A VS Code extension for Remix.run applications that super charges your development with a ever-growing set of functionalities.

## Whats new?
- Added ability to generate progressively enhanced form routes with a single click
- Added ability to generate barrel files for a folder with a single click
- Added ability to generate the whole authentication scaffolding for Remix applications with a single click 

## Features

### Generate Progressively Enhanced Form Routes with zod validation
You can now generate progressively enhanced form routes with a single click. You can either generate progressive forms with:
- `remix-hook-form` - React-hook-form wrapper for Remix.run applications
- `Conform` - Progressively enhanced form generation library

Click on the `routes` folder or anywhere inside of it and select `Generate Remix Form Route` and it will be generated for you.

### Generating authentication flows
You can now generate the whole authentication scaffolding for Remix applications with a single click. This includes:
- `auth0`
- `facebook`
- `github`
- `google`
- `microsoft`
- `discord`
- `twitter`
- `oauth2`
- `form` (email/password)

`Right click` the `app` folder and select `Generate Authentication Workflow` and select the authentication method(s) you want to use. 
After that fill the required secrets inside of the `.env` file and you are good to go.

### Generating authentication for loaders and actions
You can now add authentication to your loaders and actions with a click.
`Click` the `Add authentication` above a loader or action and it will auto generate the authentication using remix-auth.

This is configurable and you can change the import statement to reflect your authenticator location. See the [Extension Settings](#extension-settings) section on how you can customize your output

### Opening routes in the browser
You can now open up your routes in the browser from the route file itself. This is useful for when you want to test out your routes without having to go to the browser and type in the url or navigate to it.

Each route file with the default export will have a button(s) above the default export that will open up the route in the browser by clicking it.

This is configurable and you can change the url generator function and the paths that you want to generate urls for. See the [Extension Settings](#extension-settings) section on how you can customize your output

### Route File Generation
Generates every possible export from a route file for Remix.run applications. You can do this by right-clicking your routes folder and selecting convert to v2 convention.
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

### Barrelize

Barrelize your folders with a click. This will generate a barrel file for the selected folder and will export all the files inside of it. This will be done recursively for all the subfolders as well.

This is useful for when you want to import a lot of imports from a directory and you don't want to import each file individually.

> Tip: See the [Extension Settings](#extension-settings) section on how you can customize your output

## Usage


## Progressive Form routes
Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/form-demo.mp4" controls="controls" style="max-width: 730px;">
</video>

## Authentication flow
Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/auth-demo.mp4" controls="controls" style="max-width: 730px;">
</video>

## Generating routes
Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/basic-demo.mp4" controls="controls" style="max-width: 730px;">
</video>

## Barrelizing folders
Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/barrel-demo.mp4" controls="controls" style="max-width: 730px;">
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
* `remix-forge.urlGenerator`: Allows you to pass in a custom url generator function for the relative part of the url (`default is ''`).
* `remix-forge.urlGeneratorPaths`: Allows you to specify multiple url paths to generate urls for (eg. staging, production, local...) (`default is [{ title: "Local", url: "http://localhost:3000" }]`).
* `remix-forge.importAuthFrom` - Change the import statement for the Add authentication command (`default is '', this will set it to "~/services/auth.server"`).
* `remix-forge.barrelizeRemoveExtensions` - When using the Barrelize command removes the following extensions from the generated barrel file (`default is ['.ts', '.tsx', '.js', '.jsx'] => export * from "./Component(removes the .tsx)`).
* `remix-forge.barrelizeIndexExtension` - Set the generated index file extension (`default is 'ts' => index.ts`).
* `remix-forge.barrelizeIgnoreFiles` - Ignores the files that include any of the provided strings (`default is ['index', 'test', 'stories]`).
* `remix-forge.formHandler` - Choose between remix-hook-form or conform for your forms (`default is remix-hook-form`).

## Roadmap

- [x] Add ability to convert v1 route convention to v2 route convention
- [x] Add ability to change runtime dependencies
- [x] Add ability to open up your routes in the browser from the file itself.
- [x] Add ability to generate authenticated routes via actions and loaders
- [x] Add ability to barrelize folders
- [x] Add ability to generate fully progressive forms with validation
- [ ] Add ability for the extension to sniff out the runtime dependency instead of you configuring it
- [ ] Add ability to generate a component name based on the route name

## Release Notes 

## 0.1.5
- `remix-forge.formHandler` - Choose between remix-hook-form or conform for your forms (`default is remix-hook-form`).
- Ability to generate fully progressive forms with validation
- If Remix Forge generates code with dependencies you don't have installed it will prompt you to install them
 
## 0.1.4
- Added ability to barrelize folders
- `importAuthFrom` configuration option added
- `barrelizeRemoveExtensions` configuration option added
- `barrelizeIndexExtension` configuration option added
- `barrelizeIgnoreFiles` configuration option added

## 0.1.3
- Issue with generate Authentication command

## 0.1.2
- Issue with no .env present in the project when generating auth flow

## 0.1.1
- Better support for opening up routes in the browser that use the remix-flat-routes convention

## 0.1.0 
- Ability to generate the whole authentication scaffolding for Remix applications with a single click
- Ability to add authentication to your loaders with a click
- Ability to add authentication to your actions with a click
- Support for 9 Authentication methods including Facebook, Google, Auth0, Microsoft, Github, Discord and more...

##  0.0.5

- Ability to open up routes in the browser from the file via the buttons above the default export
- `urlGenerator` config option that allows you to pass in a custom function to generate your urls
- `urlGeneratorPaths` config option that allows you to specify multiple url paths to generate urls for (eg. staging, production, local...)

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
 


 

  
