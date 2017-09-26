"use strict";
const expect = require("chai").expect;
const es6Renderer = require("../es6-renderer");

describe("ES6 Renderer", () => {
  it("is a function", () => {
    expect(es6Renderer).to.be.a("function");
  });


  it("interpolates a provided string", () => {
    const titleTpl = "${engineName} - The fastest javascript template string engine!";
    const content = es6Renderer(titleTpl, {
      template: true,
      locals: { engineName: "ES6 Renderer"}

    });
    expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!");
  });


  it("escapes locals to prevent XSS", () => {
    const titleTpl = "${engineName} - The fastest javascript template string engine!";

    const escapedContent = es6Renderer(titleTpl, {
      template: true,
      locals: { engineName: "<script>alert('ES6 Renderer')</script>"}
    });

    const unescapedContent = es6Renderer(titleTpl, {
      template: true,
      locals: { engineName: "<script>alert('ES6 Renderer')</script>"},
      settings: {
        escape: false
      }
    });
    
    expect(escapedContent).to.equal("&lt;script&gt;alert(&#39;ES6 Renderer&#39;)&lt;/script&gt; - The fastest javascript template string engine!");
    expect(unescapedContent).to.equal("<script>alert('ES6 Renderer')</script> - The fastest javascript template string engine!");
  });


  describe("External templates", () => {
    it("renders a template file", done => {
      es6Renderer(
        __dirname + "/template.txt",
        { locals: { engineName: "ES6 Renderer", footer: "MIT License" } },
        (err, content) => {
          expect(err).to.be.null;
          expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!\nMIT License");
          done();
        }
      );
    });

    it("render partials", done => {
      es6Renderer(
        __dirname + "/template.txt",
        {
          locals: { engineName: "ES6 Renderer" },
          partials: {
            footer: __dirname + "/partial.txt"
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


  describe("Pre-compilation", () => {
    it("can pre-compile templates when all names are listed", () => {
      const text = '${engineName} - The fastest javascript template string engine in the whole ${place}!';
      const precompiled = es6Renderer(text, ['engineName', 'place']);
      const content = precompiled('ES6 Renderer', 'multiverse')
      expect(precompiled).to.be.a("function");
      expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine in the whole multiverse!");
    });
  
    it("can pre-compile templates using default '$' object property", () => {
      const text = '${$.engineName} - The fastest javascript template string engine in the whole ${$.place}!';
      const precompiled = es6Renderer(text)
      const content = precompiled({ engineName: 'ES6 Renderer', place: 'multiverse' });
      expect(precompiled).to.be.a("function");
      expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine in the whole multiverse!");
    });
  });

});
