/* eslint-env mocha */

const assert = require("assert");
const { parser } = require("../src/inputLib.js");


describe("parser", function() {
  
  it("should return option 'n', count 10, startingIndex 0, for defalult option", ()=>{
    let userArgs = ["file1"];
    let expectedOutput = { option: "n", count: 10, startingIndex: 0 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });

  it("should return option 'n' count 5, startingIndex 2 for user args -- file1", ()=>{
    let userArgs = ["--", "file1"];
    let expectedOutput = { option: "n", count: 10, startingIndex: 1 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });
  
  it("should return option 'n' count 5, startIndex 1, for first arg -5", ()=>{
    let userArgs = ["-5", "file1"];
    let expectedOutput = { option: "n", count: 5, startingIndex: 1 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });

  it("should return option 'n' count 5, startingIndex 2 for user args -n 5 file1", ()=>{
    let userArgs = ["-n", "5", "file1"];
    let expectedOutput = { option: "n", count: 5, startingIndex: 2 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });

  it("should return option 'c' count 5, startingIndex 2 for user args -c 5 file1", ()=>{
    let userArgs = ["-c", "5", "file1"];
    let expectedOutput = { option: "c", count: 5, startingIndex: 2 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });

  it("should return option 'n' count 5, startingIndex 1 for user args -n5 file1", ()=>{
    let userArgs = ["-n5", "file1"];
    let expectedOutput = { option: "n", count: 5, startingIndex: 1 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });

  it("should return option 'c' count 5, startingIndex 1 for user args -n5 file1", ()=>{
    let userArgs = ["-n5", "file1"];
    let expectedOutput = { option: "n", count: 5, startingIndex: 1 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  });

  it("should return option 'x', count 7, startingIndex 1 for user args -x5 file1", ()=>{
    let userArgs = ["-x7", "file1"];
    let expectedOutput = { option: "x", count: 7, startingIndex: 1 };
    assert.deepEqual(parser(userArgs), expectedOutput);
  }); 

});
  