/* eslint-env mocha */

const assert = require("assert");

const {
  getIllegalCountMessage,
} = require("../src/error.js");

describe("for getIllegalCountMessage", function() {

  it("should return line count error for given count and option: 'n' ", ()=>{
    let expectedOutput = "head: illegal line count -- 0";
    assert.strictEqual(getIllegalCountMessage(0, "n"), expectedOutput);
  });

  it("should return byte count error for given count and option: 'c' ", ()=>{
    let expectedOutput = "head: illegal byte count -- 0";
    assert.strictEqual(getIllegalCountMessage(0, "c"), expectedOutput);
  });

});