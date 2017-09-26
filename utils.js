"use strict";

const escapeMap = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#39;",
  "<": "&lt;",
  ">": "&gt;"
};

const escapeRegex = /[&"'<>]/g;

const lookupEscape = ch => escapeMap[ch];

module.exports = {
  escape(val) {
    if (typeof val !== "string") return val;
    return val.replace(escapeRegex, lookupEscape);
  }
};
