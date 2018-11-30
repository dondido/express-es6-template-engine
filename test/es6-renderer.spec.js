"use strict";
const expect = require("chai").expect;
const express = require("express");
const es6Renderer = require("../es6-renderer");

describe("ES6 Renderer", () => {

  it("is a function", () => {
    expect(es6Renderer).to.be.a("function");
  });

  it("interpolates a provided string", () => {
    const titleTpl = "${engineName} - The fastest javascript template string engine!";
    const content = es6Renderer(titleTpl, {
      template: true,
      locals: { engineName: "ES6 Renderer" }
    });
    expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!");
  });

  it("throws an error in case of interpolation failure", () => {
    const titleTpl = "${engineName} - The fastest javascript template string engine!";
    const err = es6Renderer(titleTpl, {
      template: true,
      locals: {}
    });
    expect(err instanceof Error).to.equal(true);
  });

  describe("External templates", () => {
    it("renders a template file with a callback", done => {
      es6Renderer(
        __dirname + "/index.html",
        { locals: { engineName: "ES6 Renderer", footer: "MIT License" } },
        (err, content) => {
          expect(err).to.be.null;
          expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
          done();
        }
      );
    });

    it("throws an error in case of template interpolation failure with a callback", done => {
      es6Renderer(
        __dirname + "/index.html",
        { locals: { footer: "MIT License" } },
        (err) => {
          expect(err instanceof Error).to.equal(true);
          done();
        }
      );
    });

    it("renders a template file with a promise", done => {
      const assert = (content) => {
        expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
        done();
      };
      const willRender = es6Renderer(
        __dirname + "/index.html",
        { locals: { engineName: "ES6 Renderer", footer: "MIT License" } }
      );
      willRender.then(assert);
    });

    it("renders a template file with both promise and callback", done => {
      const assert = (content) => {
        expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
        done();
      };
      es6Renderer(
        __dirname + "/index.html",
        { locals: { engineName: "ES6 Renderer", footer: "MIT License" } },
        (err, content) => {
          expect(err).to.be.null;
          expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
        }
      ).then(assert);
    });

    it("throws an error in case of template interpolation with promise failure", done => {
      const assert = (err) => {
        expect(err instanceof Error).to.equal(true);
        done();
      };
      const willRender = es6Renderer(
        __dirname + "/index.html",
        { locals: {} }
      );
      willRender.catch(assert);
    });

    it("throws an error in case of template interpolation with both promise and callback", done => {
      const assert = err => expect(err instanceof Error).to.equal(true);
      es6Renderer(
        __dirname + "/index.html",
        { locals: { engineName: "ES6 Renderer", footer: "MIT License" } },
        (err) => {
          expect(err instanceof Error).to.equal(true);
          done();
        }
      ).catch(assert);
    });

    it("merges a string and a partial file with both promise and callback", done => {
      const assertPromise = (content) => {
        expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!MIT License");
        done();
      };
      const assertCallback = (err, content) => {
        expect(err).to.be.null;
        expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!MIT License");
      };
      const template = "${engineName} - The fastest javascript template string engine!${footer}";
      const willRender = es6Renderer(
        template,
        {
          template: true,
          locals: { engineName: "ES6 Renderer", footer: "MIT License" },
          partials: { footer: __dirname + "/partial.html" }
        },
        assertCallback
      );
      willRender.then(assertPromise);
    });

    it("render partials", done => {
      es6Renderer(
        __dirname + "/index.html",
        {
          locals: { engineName: "ES6 Renderer" },
          partials: {
            footer: __dirname + "/partial.html"
          }
        },
        (err, content) => {
          expect(err).to.be.null;
          expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
          done();
        }
      );
    });

    it("throws an error when template is not found", done => {
      const assert = (err) => {
        expect(err instanceof Error).to.equal(true);
        done();
      };
      es6Renderer(
        __dirname + "/inde.html",
        {
          locals: { engineName: "ES6 Renderer" },
          partials: {
            footer: __dirname + "/partial.html"
          }
        },
        err => expect(err instanceof Error).to.equal(true)
      ).catch(assert);
    });

    it("throws an error when partials is not found", done => {
      const assert = function(err){
        expect(err instanceof Error).to.equal(true);
        done();
      };
      es6Renderer(
        __dirname + "/index.html",
        {
          locals: { engineName: "ES6 Renderer" },
          partials: {
            footer: __dirname + "/partia.html"
          }
        },
        err => expect(err instanceof Error).to.equal(true)
      ).catch(assert);
    });

  });

  describe("Precompilation", () => {
    it("can pre-compile templates when all names are listed", () => {
      const text = '${engineName} - The fastest javascript template string engine in the whole ${place}!';
      const precompiled = es6Renderer(text, 'engineName, place');
      const content = precompiled('ES6 Renderer', 'multiverse')
      expect(precompiled).to.be.a("function");
      expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine in the whole multiverse!");
    });
  
    it("can precompile templates using default '$' object property", () => {
      const text = '${$.engineName} - The fastest javascript template string engine in the whole ${$.place}!';
      const precompiled = es6Renderer(text)
      const content = precompiled({ engineName: 'ES6 Renderer', place: 'multiverse' });
      expect(precompiled).to.be.a("function");
      expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine in the whole multiverse!");
    });

    it("throws an error on template precompilation failure", () => {
      const text = '${engineName} - The fastest javascript template string engine in the whole ${place}!';
      const precompiled = es6Renderer(text, 'engineName');
      const err = precompiled('ES6 Renderer', 'multiverse')
      expect(precompiled).to.be.a("function");
      expect(err instanceof Error).to.equal(true);
    });
  });

  describe("Express", () => {
    const app = express();
    
    app.engine('html', es6Renderer);
    app.set('views', __dirname);
    app.set('view engine', 'html');

    it("renders a template file", done => {
      app.render(
        "index",
        { locals: { engineName: "ES6 Renderer", footer: "MIT License" } },
        (err, content) => {
          expect(err).to.be.null;
          expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
          done();
        }
      );
    });

    it("render partials", done => {
      app.render(
        "index",
        {
          locals: { engineName: "ES6 Renderer" },
          partials: {
            footer: "partial"
          }
        },
        (err, content) => {
          expect(err).to.be.null;
          expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
          done();
        }
      );
    });
  });

});
