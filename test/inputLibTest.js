/* eslint-env mocha */

const assert = require("assert");
const { parser } = require("../src/inputLib.js");


describe("parser", function() {
  
  it("should return option 'n', count 10, startingIndex 0, for defalult option", ()=>{
    let userArgs = ["file1"];
    let expectedOutput = { option: "n", count: 10, startingIndex: 0 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });
  
  it.skip("should return opton 'n' count 5 startIndex 1, for first arg -5", ()=>{
    let userArgs = ["-5", "file1"];
    let expectedOutput = { option: "n", count: 5, startingIndex: 1 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });
  
});
  