# Atom Space React Preset

`@atomspace/react` is a [Neutrino](https://neutrino.js.org) preset for creation of React applications.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Build Status][build-status]][travis-url]

## Features

- Zero upfront configuration necessary to start developing and building a React web app
- Modern Babel compilation supporting ES modules, last several major browser versions, async functions, dynamic imports, ES class properties, rest spread operators, decorators and automatic polyfills bound to platforms
- Webpack loaders for importing JSX components, CSS, LESS, images, icons, fonts and SVGs
- Webpack Dev Server during development
- Automatic creation of HTML pages, no templating of "index.html" necessary
- Hot Module Replacement enabled
- Disabled redundant HMR console messages
- Debug console cleared on every file change. Your outdated logs will be removed
- Resolve URLs in JSX like in HTML for such elements: `img[src]`, `link[href]`, `Image[src]`
- Consume external dependencies sourcemaps for better debugging during development
- CSS classes isolation using [`react-scoped-styles`](https://www.npmjs.com/package/react-scoped-styles)
- [MDX](https://mdxjs.com/) support
- User-friendly building progress bar
- Tree-shaking to create smaller bundles
- Production-optimized bundles with minification and source maps
- Detect and warn about circular dependencies during build time
- Extensible to customize your project as needed
- Chunking of external dependencies apart from application code. Share common dependencies between dynamic imports.
- Favicon injection
- Environment variables are automatically exposed if used
<!-- - Webpack Dev Server during development on "localhost" and local network IP for external devices access -->
<!-- - Automatically discovers free HTTP port to run a server locally -->

## Requirements

- Node.js v6.9+
- NPM v3.0+
- Neutrino v8

## Installation

`@atomspace/react` can be installed via the Yarn or NPM clients. Inside your project, make sure `neutrino` and `@atomspace/react` are development dependencies. Also you should install desired versions of `react` and `react-dom`

#### npm

```bash
npm install --save react react-dom
npm install --save-dev neutrino "@atomspace/react"
```

## Project Layout

`@atomspace/react` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available to your compiled project. Only files explicitly imported or lazy loaded to your project will be bundled.

## Quickstart

After installing Neutrino and the React preset, add a new directory named `src` in the root of the project, with a single JSX file named `index.jsx` in it. The preset cares about mounting to the `<div id="root"></div>` element and hot reload configuration. You only have to export your main component that contains your application. Edit `src/index.jsx` file with the following:

```jsx
export default function () {
   return <h1>Hello</h1>;
}
```

You can change this code base to better match your needs. Import other parts of your application and render them inside.

Now edit your project's `package.json` to add commands for starting and building the application:

```json
{
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build"
  }
}
```

And add the new file `.neutrinorc.js` in the root of the project:

```js
module.exports = {
   use: [
      '@atomspace/react'
   ]
};
```

Start the app in a development mode:

```bash
npm start
```

The console shows that application started at "localhost:3000".

## Building

`@atomspace/react` builds static assets to the `build` directory by default when running `neutrino build`:

```bash
npm run build
```

You can either serve or deploy the contents of this build directory as a static site.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place them in a directory within `src` called `static`. All files in this directory will be copied from `src/static` to `build/static`.

### Favicon

There is a special case for a favicon. You have to put a `favicon.ico` file in the source code folder. By default it is `src/favicon.ico`. The file name is conventional and can't be changed.

## Hot Reloading

The preset automatically enables Hot Module Replacement of files that was changed during development. You **don't have** to setup it by yourself.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify the preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the preset and override its options, showing the defaults:

#### .neutrinorc.js

```js
module.exports = {
   use: [
      ['@atomspace/react', {
         // Inject an application startup launcher. When `false` you need to setup DOM mounting and HMR in your sorce code
         launcher: true,

         // Document title
         title: `${packageJson.name} ${packageJson.version}`,

         // options related to a development server
         server: {
            https: false,
            public: true, // use local network IP address for hosting during development
            port: 3000,
            open: true // open default browser on `npm start`
         },

         // Add polyfills necessary for required browsers in Browserlist
         polyfills: true,

         // supported browsers in a Browserlist format
         browsers: [
            'last 2 Chrome major versions',
            'last 2 Firefox major versions',
            'last 2 Edge major versions',
            'last 2 Opera major versions',
            'last 2 Safari major versions',
            'last 2 iOS major versions',
            'IE 11'
         ]
      }]
   ]
};
```

*Example: Enable HTTPS, disable auto-opening of a browser, change the page title, define supported browsers:*

#### .neutrinorc.js

```js
module.exports = {
   use: [
      ['@atomspace/react', {
         server: {
            https: true,
            open: false
         },
         title: 'React App',
         browsers: [
            'last 3 versions'
         ]
      }]
   ]
};
```

## Customizing

Consumers may provide their custom Webpack configurations for different parts of the current preset that will override its defaults. Also if you want to construct your own preset based on `@atomspace/react` you can use information below.

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`@atomspace/react` creates some conventions to make overriding the configuration easier once you are ready to make changes. Following the customization guide and knowing the rule, loader, and plugin IDs,
you can override and augment the build by providing a function to your `.neutrinorc.js` use array. You can also make these changes from the Neutrino API in a custom middleware.

## VSCode tips

These are suggested workspace settings:

#### .vscode/settings.json

```json
{
   "files.autoSave": "onFocusChange"
}
```

[npm-image]: https://img.shields.io/npm/v/@atomspace/react.svg
[npm-downloads]: https://img.shields.io/npm/dt/@atomspace/react.svg
[npm-url]: https://npmjs.org/package/@atomspace/react
[build-status]: https://travis-ci.org/atomspace/atomspace-react.svg?branch=master
[travis-url]: https://travis-ci.org/atomspace/atomspace-react
