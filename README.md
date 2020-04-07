# Atom Space React Preset

`@atomspace/react` is a [Neutrino](https://neutrino.js.org) preset for React applications development.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Build Status][build-status]][travis-url]

## What is Neutrino?

[Neutrino](https://neutrino.js.org) is a configuration engine that allows to bundle Webpack configurations or their parts as modules and publish them to NPM. Such modules usually are called presets or middlewares. They are designed to work in conjunction with Neutrino core in your project. You can compose compilation, linting, testing and other configurations, and share them to developers.

## What features does this preset provide?

This preset does all dirty job for setting up Webpack for you. It implements a setup of projects based on [React](https://reactjs.org) in a browser.

### Features

- Zero upfront configuration necessary to start developing and building a React web app
- Modern Babel compilation supporting ES modules, last several major browser versions, async functions, dynamic imports, ES class properties, rest spread operators, decorators and automatic polyfills bound to platforms
- Production-optimized bundles with minification and source maps
- Tree-shaking to create smaller bundles
- Consider external dependencies sourcemaps for better debugging during development
- Chunking of external dependencies apart from application code. Share common dependencies between dynamic imports.
- Webpack loaders for importing JSX components, TypeScript, CSS, LESS, images, icons, fonts and SVGs
- Resolve URLs in JSX like in HTML for these elements: `img[src]`, `link[href]`, `Image[src]`, `video[src]`, `Video[src]`, `audio[src]`, `Audio[src]`
- Webpack Dev Server during development on "localhost" and local network IP for external devices access
- Automatic creation of HTML pages, no templating of "index.html" necessary
- Hot Module Replacement enabled
- Disabled redundant `[HMR]` console messages
- Debug console cleared on every file change. Your outdated logs will be removed
- CSS classes isolation using [`react-scoped-styles`](https://www.npmjs.com/package/react-scoped-styles)
- [MDX](https://mdxjs.com/) support
- Favicon injection
- Developer-friendly building progress bar
- Detect and warn about circular dependencies during the build time
- Git revision information through environment variables (VERSION, COMMITHASH, BRANCH)
- Environment variables are automatically exposed if used
- Bundle Analyzer for production and development builds
- Auto-open the application in the development mode
<!-- - Automatically discovers free HTTP port to run a server locally -->

## Requirements

- Node.js v10+
- Neutrino v9
- Webpack v4

## Installation

`@atomspace/react` can be installed with NPM. Inside your project, make sure `neutrino`, `webpack` and `@atomspace/react` are development dependencies. Also you should install desired versions of `react` and `react-dom`

```bash
npm install --save react-dom react
npm install --save-dev neutrino "@atomspace/react" webpack webpack-cli webpack-dev-server
```

Now edit your project's `package.json` to add commands for starting and building the application:

```json
{
  "scripts": {
     "start": "webpack-dev-server",
     "build": "webpack"
  }
}
```

Then add the new file `.neutrinorc.js` in the root of the project:

```js
let react = require('@atomspace/react');

module.exports = {
   use: [
      react()
   ]
};
```

And create a `webpack.config.js` file in the root of the project, that uses the Neutrino API to access the generated webpack config:

```js
let neutrino = require('neutrino');

module.exports = neutrino().webpack();
```

## Project Layout

`@atomspace/react` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This means that by default all project source code should live in a directory named `src` in the root of the project. This includes JavaScript files, stylesheets, images, and any other assets that would be available to your compiled project. Only files explicitly imported or lazy loaded to your project will be bundled. You may use JavaScript or TypeScript for development. The entry file may be any of both: `src/index.jsx` or `src/index.tsx`

## Quickstart

After installing Neutrino and this preset, add a new directory named `src` in the root of the project, with a single JSX file named `index.jsx` in it. The preset cares about mounting to the `<div id="root"></div>` element and hot reload configuration. You only have to export your main component that refers to your application. Edit `src/index.jsx` file with the following:

```jsx
export default function () {
   return <h1>Hello</h1>;
}
```

You can change this code base to better match your needs. Import other parts of your application and render them inside.

Start the app in a development mode:

```bash
npm start
```

The console shows that application compilation is finished and started at "localhost:3000".

## Building

The project builds static assets to the `build` directory by default when running `npm run build`:

```bash
❯ webpack

√ React-app 1.0.0
  Compiled successfully in 15.77s

Version: webpack 4.41.5
Time: 15700ms
Built at: 2020-01-29 23:46:56
                                             Asset      Size  Chunks             Chunk Names
       images/1d535df5e2e3bb126160e27b9235024f.jpg  58.1 KiB          [emitted]
                                 compiled/index.js   365 KiB       0  [emitted]  index
```

You can either serve or deploy the contents of this build directory as a static site.

## Hot Module Replacement

As `@atomspace/react` completely controls the launching of your application instance. It automatically enables Hot Module Replacement for all files during development. No extra configuration or changes in your source code are necessary. You don't need to restart the application every time files are changed.

Using dynamic imports with `import()` will automatically create split points and hot replace those modules upon modification during development.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place them in a directory within `src` called `static`. All files in this directory will be copied from `src/static` to `build/static`.

### Favicon

There is a special case for a favicon. You have to put a `favicon.ico` file in the source code folder. By default it is `src/favicon.ico`. The file name is conventional and can't be changed.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this preset works. You can modify the preset settings from `.neutrinorc.js` by an options object.

The following shows how you can pass an options object to the preset and override its options, showing the defaults:

#### .neutrinorc.js

```js
let react = require('@atomspace/react');

module.exports = {
   use: [
      react({
         // Inject an application startup launcher. When `false` you need to setup DOM mounting and HMR in your sorce code
         launcher: true,

         // Document title and the name of the terminal progress bar
         title: `${packageJson.name} ${packageJson.version}`,

         // Options related to a development server
         server: {
            https: false,
            public: true, // use local network IP address for hosting during development
            port: 3000,
            open: false // open  on `npm start`
         },

         // Automatically open a default browser on `npm start`
         open: false,

         // Add polyfills necessary for required browsers in `browsers` option depending on the usage in the code
         polyfills: false,

         // Supported browsers in a Browserlist format. The code will be transpiled to support them
         browsers: [
            'last 2 Chrome major versions',
            'last 2 Firefox major versions',
            'last 2 Edge major versions',
            'last 2 Opera major versions',
            'last 2 Safari major versions',
            'last 2 iOS major versions',
            'IE 11'
         ],

         // Enable source maps in the production build. Development sourcemaps are not affected and always turned on
         sourcemaps: true
      })
   ]
};
```

*Example: Enable HTTPS, enable auto-opening of a browser, change the page title, define supported browsers:*

#### .neutrinorc.js

```js
let react = require('@atomspace/react');

module.exports = {
   use: [
      react({
         server: {
            https: true
         },
         open: true,
         title: 'React App',
         browsers: [
            'last 3 versions'
         ]
      })
   ]
};
```

## Customizing

Consumers may provide their custom Webpack configurations for different parts of the current preset that will override its defaults. Also if you want to construct your own preset based on `@atomspace/react` you can use information below.

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization). `@atomspace/react` creates some conventions to make overriding the configuration easier once you are ready to make changes. Following the customization guide and knowing the rule, loader, and plugin IDs, you can override and augment the build by providing a function to your `.neutrinorc.js` use array. You can also make these changes from the Neutrino API in a custom middleware.

By default Neutrino, and therefore this preset, creates a single **main** `index` entry point to your application, and this maps to the `index.*` file in the `src` directory.

> **Important! This preset has a limitation – it supports only a single entry point when the launcher option is enabled. Defining 2 or more may cause it to work not properly.**

You can customize a single entry point in your `.neutrinorc.js` and override a default one

```js
let react = require('@atomspace/react');

module.exports = {
   options: {
      mains: {
         index: './App.jsx'
      }
   },
   use: [
      react()
   ]
};
```

### Launcher

This preset wraps your application with React Hot Loader. It can be configured using `launcher` property in the [preset options](#preset-options). So you don't need to think about how to mount and render your application. This is completely managed by `@atomspace/react` preset.

If you want to **disable** the launcher you need to explicitly set the option to `false`

```js
react({
   launcher: false
});
```

This turns your application into a regular Web application. You will have to manage the starting by yourself as it is described in [React documentation](https://reactjs.org/docs/add-react-to-a-website.html).

## Webpack config

Sometime you want to extend Webpack configuration with custom loaders or plugins. This can be done in `.neutrinorc.js` file using [Neutrino API](https://neutrinojs.org/webpack-chain/) also known as [`webpack-chain`](https://www.npmjs.com/package/webpack-chain).

### Plugins

For example, you can add [TypeScript checking](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin)

```js
let react = require('@atomspace/react');
let TsChecker = require('fork-ts-checker-webpack-plugin');

module.exports = {
   use: [
      react(),
      function (neutrino) {
         let prodMode = process.env.NODE_ENV === 'production';

         if (prodMode) return;

         neutrino.config
            .plugin('ts-checker')
               .use(TsChecker, [{
                  // options
               }])
               .end();
      }
   ]
};
```

Specifically for this plugin you also need to create `tsconfig.json` file

```json
{
   "compilerOptions": {
      "target": "es2016",
      "module": "commonjs",
      "jsx": "react",
      "strict": true,
      "alwaysStrict": true,
      "moduleResolution": "node",
      "esModuleInterop": true
   },
   "include": ["src/**/*"],
   "exclude": ["node_modules"]
}
```

It will enable highlighting in your code editor too.

## Troubleshooting

### Memory limit

Quite often during the production build of large projects there is not enough memory for the NodeJS process.

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

To resolve this you should increase the limit using CLI flags

```json
{
   "scripts": {
      "build": "node --max-old-space-size=8192 node_modules/webpack/bin/webpack"
   }
}
```

### Local builds

By default the project is built with settings optimized for Browser History API. It can't properly run in the File System using `file://` protocol. To make it run locally with double click on `index.html` you can add custom middleware to **.neutrinorc.js** file that overrides some settings

```js
let react = require('@atomspace/react');

module.exports = {
   use: [
      react(),
      function ({ config }) {
         // necessary for correct work on local File System
         config.output.publicPath('./');
      }
   ]
};
```

## VSCode tips

### Project settings

These are suggested workspace settings for VSCode editor:

#### .vscode/settings.json

```json
{
   "files.autoSave": "onFocusChange"
}
```

This should prevent constant building as you type code.

[npm-image]: https://img.shields.io/npm/v/@atomspace/react.svg
[npm-downloads]: https://img.shields.io/npm/dt/@atomspace/react.svg
[npm-url]: https://npmjs.org/package/@atomspace/react
[build-status]: https://travis-ci.org/atomspace/atomspace-react.svg?branch=master
[travis-url]: https://travis-ci.org/atomspace/atomspace-react
