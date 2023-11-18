# Remix Forge

Remix Forge - A VS Code extension for Remix.run applications that super charges your development with a ever-growing set of functionalities.

## Whats new?
- Added MonoRepo support
- Added ability to inject code snippets into your active editor via right-click
- Added ability to initialize a project for shadcn/ui components in Remix
- Added ability to generate all supported components by the shadcn/ui CLI
- Added ability to initialize eslint and prettier in your Remix project
- Added ability to generate test files for your routes (or anything else)
- Added ability to initialize Prisma in your Remix app
- Added ability to generate progressively enhanced form routes with a single click 
- Added ability to generate the whole authentication scaffolding for Remix applications with a single click 
- Added a notification on startup that lets you know there is a new version of Remix.run available

## Features

### Insert Remix code snippets in your current editor

Right click the line where you want to insert a snippet and click the corresponding command you want to run. This will insert the snippet in your current editor at the line you right clicked. (eg. insert loader => inserts loader into the file)

### Get your Remix project shadcn/ui ready

Right click your `package.json` and initialize all the setup required for shadcn/ui tailored to Remix instead of Next.js. This will add the following to your project:
- tailwind config and turn on the tailwind Remix compiler if not done already
- Adds the css file and imports it into root if possible
- Sets up the utils folder in the specified directory
- Adds the `@/` alias to your tsconfig.json

After that right click your `app` folder and add the shadcn/ui components to your application, just specify where you want to store them and you're good to go. The extension will generate the components for you and add them to your `app/components/ui` folder by default, or the location specified by you and remember it.
 
### Initialize eslint and prettier in your Remix project

- Right click your `package.json` file and add eslint and prettier to your project configured with remix eslint

### Generate test files for your routes (or anything else)

- Right click your .ts or .tsx file and click Generate tests and it will generate a test file for you with all the exports imported and ready to be tested. This is useful for when you want to test your routes or any other file that you want to test. 

- If you do not colocate your test files the extension will try to find it in your workspace depending on your search settings. See the [Extension Settings](#extension-settings) section on how you can customize your search.

- If you already have an existing file it will add all the exports that you didn't import into the file for you (eg. if you already tested your loader and component and you add an action it will only add the action import and the action test for you)

This works for any .ts and .tsx file and is not specific to remix routes. You can use this for any file that you want to test.

### Initialize Prisma in your Remix app
You can now initialize Prisma in your Remix app with a single click. You can do this by right-clicking your `app` folder and selecting `Initialize Prisma` and it will be initialized for you. You choose your database and it will be configured for you. Also adds package.json
commands for running migrations, seeding the database, generating the client and running prisma studio.

### Update Remix to a newer version

You can now update your Remix to a newer version with a single click. You can do this by right-clicking your `package.json` file and selecting `Update Remix` and it will be updated for you. You can update to the latest version or specify a version you want to update to.
Defaults to the latest one. This uses `npx upgrade-remix` built and maintained by the Remix team. [Github repo here](https://github.com/brophdawg11/upgrade-remix)

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

## Inserting snippets
Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/inserts-demo.mp4" controls="controls" style="max-width: 730px;">
</video>

## Shadcn/ui Generation
Here is an example video of the basic usage:

<video src="https://raw.githubusercontent.com/Code-Forge-Net/Remix-Forge/main/shadcn-ui-demo.mp4" controls="controls" style="max-width: 730px;">
</video>

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
* `remix-forge.urlDebug` - Allows you to debug your url generator function (`default is false`).
* `remix-forge.searchStrategy` - Allows you to configure how to search for your test files (enum of three values `one-up` - searches one directory above and all subdirectories, `sub` - searches current directory and all subdirectories, `all`- searches the whole project) - default is `one-up`.
* `remix-forge.componentFolder` - Allows you to specify the folder where your shadcn/ui components are located (`default is 'app/components/ui'`).
* `remix-forge.customActionImports` - Allows you to specify custom imports for your actions when generating route files
* `remix-forge.customLoaderImports` - Allows you to specify custom imports for your loaders when generating route files
* `remix-forge.formRouteTemplate` - Allows you to specify a custom template for your form route files
* `remix-forge.latestRemixNotification` - Allows you to disable the notification that shows up when a new version of Remix is available (`default is true`).

## Roadmap

- [x] Add ability to convert v1 route convention to v2 route convention
- [x] Add ability to change runtime dependencies
- [x] Add ability to open up your routes in the browser from the file itself.
- [x] Add ability to generate authenticated routes via actions and loaders
- [x] Add ability to barrelize folders
- [x] Add ability to generate fully progressive forms with validation
- [x] Add ability to setup prisma in your Remix project
- [x] Add ability to update Remix to the latest or specified version
- [x] Add ability to generate test files
- [x] Add ability to initialize eslint and prettier
- [x] Add ability to setup and generate shadcn/ui components in your Remix project
- [ ] Add ability to setup stripe in your Remix projects
- [ ] Add ability for the extension to sniff out the runtime dependency instead of you configuring it
- [ ] Add ability to generate a component name based on the route name

## Release Notes 

## 0.5.0 

Monorepo support

## 0.4.0
- Added Remix Dev Tools connectivity to the extension

## 0.3.4

- Added ability to insert code snippets into your active editor window via right-click

## 0.3.3 
- Full revamp of the shadcn-ui init and generate commands to support the new CLI

## 0.3.1 
- `remix-forge.latestRemixNotification` - Allows you to disable the notification that shows up when a new version of Remix is available (`default is true`).
- Added a notification on startup that lets you know there is a new version of Remix.run available

## 0.3.0 

### Features
- Added ability to initialize a project for shadcn/ui components in Remix
- Added ability to generate all supported components by the shadcn/ui CLI

### Configuration
- `remix-forge.componentFolder` - Allows you to specify the folder where your shadcn/ui components are located (`default is 'app/components/ui'`).
- `remix-forge.customActionImports` - Allows you to specify custom imports for your actions when generating route files
- `remix-forge.customLoaderImports` - Allows you to specify custom imports for your loaders when generating route files
- `remix-forge.formRouteTemplate` - Allows you to specify a custom template for your form route files

- Changed the auth flow generation to output the AuthStrategies object into a separate file so it can be imported in both server/client bundles

## 0.2.0
- Added ability to initialize eslint and prettier in your Remix project

## 0.1.8
- `remix-forge.searchStrategy` - Allows you to configure how to search for your test files
- Added ability to generate test files for your .ts and .tsx files

## 0.1.7 
- `remix-forge.urlDebug` - Allows you to debug your url generator function (`default is false`).
- Added ability to setup prisma in your Remix project with a single click
- Added ability to update your Remix to a newer version with a single click

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
 


 

  
