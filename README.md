# Build Checker App

A simple app for check status CI status using Electron JS

## Installation

```bash
git clone https://github.com/b52/electron-es6-react.git
cd electron-es6-react
npm install
bower install
gulp serve
```

## Package application

```bash
npm run build
```

## Directory structure

```
- dist/             Packaged applications for platforms
- src/                 Source directory
 |- assets/
  |+ images/
 |- browser/           For browser process scripts
  |+ menu/
 |- renderer/          For renderer process scripts and resources
  |+ components/       React components
  |  bootstrap.js      Entry point for render process
 |- styles/            SCSS directory
 |  app.js             Entry point for browser process
  bower.json           Bower package (optional)
  gulpfile.js          Gulp tasks
  package.json
```


[ES6]: http://exploringjs.com/
[React]: https://facebook.github.io/react/
[Electron]: http://electron.atom.io/
[Babel]: http://babeljs.io
