"use strict";
const expect = require("chai").expect;
const es6Renderer = require("../es6-renderer");

describe("ES6 Renderer", () => {
  it("is a function", () => {
    expect(es6Renderer).to.be.a("function");
  });

  it("renders a provided string syncronously", () => {
    const titleTpl = "${engineName} - The fastest javascript template string engine!";
    const content = es6Renderer(titleTpl, {
      template: true,
      locals: { engineName: "ES6 Renderer", footer: "MIT License" }
    });
    expect(content).to.equal("ES6 Renderer - The fastest javascript template string engine!");
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
});
