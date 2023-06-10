# Change Log


All notable changes to the "remix-forge" extension will be documented in this file. 

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