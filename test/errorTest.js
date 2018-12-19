/* eslint-env mocha */

const assert = require("assert");

const {
  getIllegalCountMessage,
  getIllegalOptionMessage,
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