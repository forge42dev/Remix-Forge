# Change Log

All notable changes to the "remix-forge" extension will be documented in this file. 

## [0.5.5]

- Updated Remix Form Route with conform v1 

## [0.5.3]
- Added `clientLoader` generator
- Added `clientAction` generator
- Overhauled the execution of tasks to be seen in VS code terminal. This will allow you to see the output of the commands being run in the terminal

## [0.5.1]
- fix for version not being defined

## [0.5.0]

Monorepo support. Run commands inside your monorepo. It won't add code to the root but rather the selected workspace.
Bug fixes and improvements.
Shadcn-ui initialization fix

## [0.4.6]
V2 Support for loaders and actions
## [0.4.1]
### Modified
- Changed import for v2 meta function

## [0.4.0]
### Added
- Ability to connect Remix Dev Tools to your project

## [0.3.4] 
### Added
- Ability to insert code snippets in your active editor
### Modified
- No longer allows you to generate shadcn-ui components if you don't have a components.json file in your project

## [0.3.3] 
### Modified
- Full revamp of the shadcn-ui init and generate commands to support the new CLI

## [0.3.2]
### Fixed
- Issue with shadcn-ui initialization not working properly

## [0.3.1]
### Added
- `remix-forge.latestRemixNotification` - Allows you to disable the notification that shows up when a new version of Remix is available (`default is true`).
- Added a notification on startup that lets you know there is a new version of Remix.run available

## [0.3.0]
### Added

#### Features
- Added ability to initialize a project for shadcn/ui components in Remix
- Added ability to generate all supported components by the shadcn/ui CLI

#### Configuration
- `remix-forge.componentFolder` - Allows you to specify the folder where your shadcn/ui components are located (`default is 'app/components/ui'`).
- `remix-forge.customActionImports` - Allows you to specify custom imports for your actions when generating route files
- `remix-forge.customLoaderImports` - Allows you to specify custom imports for your loaders when generating route files
- `remix-forge.formRouteTemplate` - Allows you to specify a custom template for your form route files

### Modified
- Changed the auth flow generation to output the AuthStrategies object into a separate file so it can be imported in both server/client bundles

## [0.2.1]
### Modified
- Changed the auth flow generation to output an object instead of an enum

## [0.2.0]
### Added
- Added ability to initialize eslint and prettier in your Remix project

## [0.1.8]
### Added
- `remix-forge.searchStrategy` - Allows you to configure how to search for your test files
- Added ability to generate test files for your .ts and .tsx files

## [0.1.7]
### Added
- `remix-forge.urlDebug` - Allows you to debug your url generator function (`default is false`).
- Added ability to setup prisma in your Remix project with a single click
- Added ability to update your Remix to a newer version with a single click
### Fixed
- Issue with one of the runtime dependencies of generate auth flow not being dynamic

## [0.1.5]
### Added
- `remix-forge.formHandler` - Choose between remix-hook-form or conform for your forms (`default is remix-hook-form`).
- Ability to generate fully progressive forms with validation
- If Remix Forge generates code with dependencies you don't have installed it will prompt you to install them
### Fixed
- Issue with one of the runtime dependencies of generate auth flow not being dynamic

## [0.1.4]
### Added
- Barrelize command that allows you to generate a barrel file for a folder with a single click
- `remix-forge.importAuthFrom` - Change the import statement for the Add authentication command (`default is '', this will set it to "~/services/auth.server"`).
- `remix-forge.barrelizeRemoveExtensions` - When using the Barrelize command removes the following extensions from the generated barrel file (`default is ['.ts', '.tsx', '.js', '.jsx'] => export - from "./Component(removes the .tsx)`).
- `remix-forge.barrelizeIndexExtension` - Set the generated index file extension (`default is 'ts' => index.ts`).
- `remix-forge.barrelizeIgnoreFiles` - Ignores the files that include any of the provided strings (`default is ['index', 'test', 'stories]`).


## [0.1.3]
### Fixed
- Issue with generate Authentication command

## [0.1.2]
### Fixed
- Issue with no .env present in the project when generating auth flow

## [0.1.1]
### Added
- Better support for opening up routes in the browser that use the remix-flat-routes convention

## [0.1.0]
### Added
- Ability to generate the whole authentication scaffolding for Remix applications with a single click
- Ability to add authentication to your loaders with a click
- Ability to add authentication to your actions with a click
- Support for 9 Authentication methods including Facebook, Google, Auth0, Microsoft, Github, Discord and more...

## [0.0.5]
### Added
- Ability to open up routes in the browser from the file via the button above the default export
- `urlGenerator` config option that allows you to pass in a custom function to generate your urls
- `urlGeneratorPaths` config option that allows you to specify multiple url paths to generate urls for (eg. staging, production, local...)

## [0.0.4]

### Added
- Ability to convert v1 route convention to v2 route convention
- Ability to change runtime dependencies

### Changed
- Updated readme
- Moved the commands to a separate context menu section

## [0.0.3]

- Readme update

## [0.0.2]

- Readme update

## [0.0.1]

- Initial release