Express ES6 string template engine
======

ES6 Renderer is simple, super fast, and extendable Template Engine for the Express Framework which uses pure ES6 Javascript syntax.
It works by scanning files in a working directory, then reading the contents of the files and converting them from plain strings to ES6 template strings. ES6 template strings are string literals enclosed by the back-tick. They feature String Interpolation, Embedded Expressions, Multiline strings and String Tagging for safe HTML escaping, localisation, etc. Once convertion is completed its then compiled to plain text by the V8 engine, harnessing 100% of its power. Being less than 1kb, ES6 Renderer offloads a lot of the processing directly to the V8 interpreter, which compiles the code and runs as fast as the rest of the Express App. In fact, ES6 Renderer shouldn't add any overhead to the project at all! It should also allow us to implement any functionality we like within the bounds of Javascript.

### Usage

```javascript
var express = require('express'),
  es6Renderer = require('es6-renderer'),
  app = express();
  
app.engine('html', es6Renderer({}));
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

## License

MIT License

Copyright (c) 2015 Dian Dimitrov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
