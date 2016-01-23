Express ES6 string template engine
======

ES6 Renderer is simple, super fast, and extendable Template Engine for the Express Framework which uses pure ES6 Javascript syntax.
It works by scanning files in a working directory, then reading the contents of the files and converting them from plain strings to ES6 template strings. ES6 template strings are string literals enclosed by the back-tick. They feature String Interpolation, Embedded Expressions, Multiline strings and String Tagging for safe HTML escaping, localisation, etc. Once convertion is completed its then compiled to plain text by the V8 engine, harnessing 100% of its power. Being less than 1kb, ES6 Renderer offloads a lot of the processing directly to the V8 interpreter, which compiles the code and runs as fast as the rest of the Express App. In fact, ES6 Renderer shouldn't add any overhead to the project at all! It should also allow us to implement any functionality we like within the bounds of Javascript.

Minimum requirements Node.js `v4.0.0`.

[![Package Version](https://img.shields.io/badge/npm-4.0.0-blue.svg)](https://www.npmjs.com/package/express-es6-template-engine)

### Installation

```bash
$ npm i express-es6-template-engine --save
```

### Features

* No Dependencies
* Fully Configurable
* Compiled and interpreted by V8 (Super Fast)
* Learning new syntax is not required
* Partials Support
* Conditional Support
* Iterators Support
* Native Javascript Support

### Usage

#### Setup

The basics required to integrate ES6 renderer in your app are pretty simple and easy to implement:

```javascript
var express = require('express'),
  es6Renderer = require('express-es6-template-engine'),
  app = express();
  
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.get('/', function(req, res) {
  res.render('index', {locals: {title: 'Welcome!'}});
});

app.listen(3000);
```

Before Express can render template files, the following application settings must be set:

- views, the directory where the template files are located. Eg: app.set('views', './views')
- view engine, the template engine to use. Eg: app.set('view engine', 'html')

HTML template file named index.html in the views directory is needed, with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
</head>
<body>
    <h1>${title}</h1>
</body>
</html>
```
Route to render the index.html file is expected. If the view engine property is not set, we must specify the extension of the view file. Otherwise, it can be safely omitted.

```javascript
app.get('/', function(req, res) {
  res.render('index', {locals: {title: 'Welcome!'}});
});
```
Express-compliant template engines such as ES6 Renderer export a function named __express(filePath, options, callback), which is called by the res.render() function to render the template code. When a request is made to the home page, the index.html file will be rendered as HTML.

#### Rendering a template

Within your app route callback, call `res.render`, passing any partials and local variables required by your template. For example:

```javascript
res.render('index', {
    locals: {
      title:  'Welcome!'
    },
    partials: {
      template: 'template.html'
    }
  });
```

Having the index.html file with the following content in your view directory is need:

```html
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
</head>
<body>
    <h1>${title}</h1>
    <main>${template}</main>
</body>
</html>
```

Partial template with a file name template.html will be injected into index.html:

```html
<div>No learning of a template engine syntax required! Pure vanilla javascript certified!</div>
```

The content below will be rendered on the client side as a response from the Express app:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
    <h1>Welcome!</h1>
    <div>No learning of a template engine syntax required! Pure vanilla javascript certified!</div>
</body>
</html>
```

All templates files paths are defined as absolute to the root directory of the project.

#### Compiling a string

ES6 Renderer rendering functionality has separate scanning, parsing, string generation and response sending phases. Compilation is pretty much the same but without the response sending phase. This feature can be useful for pre-processing templates on the server.
Compiling has the following syntax:

```javascript
var titleTpl = '${engineName} - The fastest javascript template string engine!',
    cb = (err, content) => err || content,
    compiledTitle = es6Renderer(titleTpl, {locals:{engineName: 'ES6 Renderer'}, template: true}, cb);
```
If string is rendered as in the example provided above a 'template' option needs to be set to true.

#### Conditional statements

ES6 Renderer dynamically evaluates code in JavaScript. If the argument is an expression, ES6 Renderer evaluates the expression. If the argument is one or more JavaScript statements, the engine executes the statements. A simplified example of using conditional statement is presented below.

A route path on the server side:

```javascript
res.render('index', {
    locals: {
      maintainedBy:  'Good Samaritans'
    }
  });
```

And a conditional statement in a html file like the one below:

```html
ES6 Renderer is ${maintainedBy ? `a template engine maintained by ${maintainedBy}` : 'not maitaned anymore'}.
```

Will result in the following:

```html
ES6 Renderer is a template engine maintained by Good Samaritans.
```

#### Iterators

Iterating over arrays and objects is quite straight forward and intuitive (knowledge of basic javascript here is essential). An object literal is passed to a html template:

```javascript
res.render('index', {
    locals: {
      features:  [
      { 
        dt: 'Multi-line strings', 
        dd: 'Any new line characters inserted in the source are part of the template string.' 
      },
      { 
        dt: 'Expression interpolation', 
        dd: 'Template strings can contain placeholders. These are indicated by dollar sign and curly braces.' 
      },
    ]
    }
  });
```

The html templates holds the following logic:

```html
<dl>
  ${features.map(f => `
    <dt>${f.dt}</dt>
    <dd>${f.dd}</dd>
  `).join('')}
</dl>
```

And the following is received by the client side:

```html
<dl>
    <dt>Multi-line strings</dt>
    <dd>Any new line characters inserted in the source are part of the template string.</dd>
    <dt>Expression interpolation</dt>
    <dd>Template strings can contain placeholders. These are indicated by dollar sign and curly braces.</dd>
</dl>
```



### License

MIT License

Copyright (c) 2015 Dian Dimitrov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
