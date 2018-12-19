/* eslint-env mocha */

const assert = require("assert");

const {
  getIllegalOptionMessage,
  getCountError,
} = require("../src/error.js");

describe("for getIllegalOptionMessage", function() {
  const errorMsgForHead = "head: illegal option -- ";
  const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
  const errorMsgForTail = "tail: illegal option -- "; 
  const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 
  
  it("should return error message of head, for operation head", ()=>{
    let expectedOutput = errorMsgForHead + "a" + "\n" + usageMsgForHead;
    assert.strictEqual(getIllegalOptionMessage("head", "a" ), expectedOutput);
  });

  it("should return error message of tail for operation tail", ()=>{
    let expectedOutput = errorMsgForTail + "x" + "\n" + usageMsgForTail;
    assert.strictEqual(getIllegalOptionMessage("tail", "x"), expectedOutput);
  });

});

describe("for getCountError", function() {

  it("should return a invalid count msg for operation head, option n, count 0", ()=>{
    let expectedOutput = "head: illegal line count -- 0";
    assert.strictEqual(getCountError("head", "n", "0"), expectedOutput);
  });

  it("should return a invalid count msg for operation head, option n, count 2.5", ()=>{
    let expectedOutput = "head: illegal line count -- 2.5";
    assert.strictEqual(getCountError("head", "n", "2.5"), expectedOutput);
  });

  it("should return a invalid count msg for operation head, option n, count 10x", ()=>{
    let expectedOutput = "head: illegal line count -- 10x";
    assert.strictEqual(getCountError("head", "n", "10x"), expectedOutput);
  });

  it("should return a invalid count msg for operation head, option c, count 10x", ()=>{
    let expectedOutput = "head: illegal byte count -- 10x";
    assert.strictEqual(getCountError("head", "c", "10x"), expectedOutput);
  });

  it("should return a invalid count msg for operation head, option n, count 0", ()=>{
    let expectedOutput = "head: illegal line count -- 0";
    assert.strictEqual(getCountError("head", "n", "0"), expectedOutput);
  });

  it("should return a invalid count msg for operation tail, option n, count 0", ()=>{
    assert.strictEqual(getCountError("tail", "n", "0"), "");
  });

  it("should return a invalid count msg for operation tail, option c, count 0", ()=>{
    assert.strictEqual(getCountError("tail", "n", "0"), "");
  });

  it("should return a invalid count msg for operation tail, option n, count 2.5", ()=>{
    let expectedOutput = "tail: illegal offset -- 2.5";
    assert.strictEqual(getCountError("tail", "n", "2.5"), expectedOutput);
  });

  it("should return a invalid count msg for operation tail, option c, count 10x", ()=>{
    let expectedOutput = "tail: illegal offset -- 10x";
    assert.strictEqual(getCountError("tail", "c", "10x"), expectedOutput);
  });

});