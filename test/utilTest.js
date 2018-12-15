/* eslint-env mocha */
const assert = require("assert");

const {
  isOptionLine,
  isOptionChar,
  splitByLine,
  splitByChar,
  isFileInvalid,
} = require("../src/util.js");

const dummyReader = (content) => content;

describe("isOptionLine", function() {

  it("should return true for \"-n\" given as first argument", function() {
    let userInput = ["n", "head.js", "-n", "5", "file1"];
    assert.equal(isOptionLine(userInput), true);
  
    userInput = ["n", "head.js", "-n5", "file1"];
    assert.equal(isOptionLine(userInput), true);
  });
  
  it("should return true for \"--\" given as first argument", function() {
    let userInput = ["n", "head.js", "--", "5", "file1"];
    assert.equal(isOptionLine(userInput), true);
  });
  
  it("should return true if first argument is a integer", function() {
    let userInput = ["n", "head.js", "-5", "file1"];
    assert.equal(isOptionLine(userInput), true);
  });
  
  it("should reutrn true if first argument is a possible filePath", function() {
    let userInput = ["n", "head.js", "5"];
    assert.equal(isOptionLine(userInput), true);
  
    userInput = ["n", "head.js", "file1"];
    assert.equal(isOptionLine(userInput), true);
  });
  
  it("should return false if first  argument is invalid", function() {
    let userInput = ["n", "head.js", "-a", "file1"];
    assert.equal(isOptionLine(userInput), false);
  
    userInput = ["n", "head.js", "-r", "file1"];
    assert.equal(isOptionLine(userInput), false);
  });
  
  it("should return false for \"-c\" given as first argument", function() {
    let userInput = ["n", "head.js", "-c", "file1"];
    assert.equal(isOptionLine(userInput), false);
  });
  
});
  
describe("isOptionChar", function() {
  
  it("should return true for \"-c\" as first argument", function() {
    let userInput = ["n", "head.js", "-c", "file1"];
    assert.equal(isOptionChar(userInput), true);
  });
  
  it("should return false for \"-n\" as first argument", function() {
    let userInput = ["n", "head.js", "-n", "file1"];
    assert.equal(isOptionChar(userInput), false);
  });
  
  it("should return false for every other input than \"-c\"", function() {
    let userInput = ["n", "head.js", "-a", "file1"];
    assert.equal(isOptionChar(userInput), false);
  
    userInput = ["n", "head.js", "-5", "file1"];
    assert.equal(isOptionChar(userInput), false);
  
    userInput = ["n", "head.js", "file1"];
    assert.equal(isOptionChar(userInput), false);
  });
  
});
  
describe("splitByLine", function() {
  
  describe("for given a source and a reader", function() {
    it("should return each line of source in an array", function() {
  
      let input = "abcdefgh\n";
      input += "ijklmnop\n";
      input += "qrstuvwxyz";
  
      let expectedOutput = ["abcdefgh", "ijklmnop", "qrstuvwxyz"];
      assert.deepEqual(splitByLine(input, dummyReader), expectedOutput);
    });
  });
  
});
  
describe("splitByChar", function() {
  
  describe("for given a  source and reader", function() {
    it("should return each character of source in an array", function() {
      let input = "ABCD\nEFGH";
      let expectedOutput = ["A", "B", "C", "D", "\n", "E", "F", "G", "H"];
      assert.deepEqual(splitByChar(input,dummyReader), expectedOutput);
    });
  });
  
});

describe("isFileInvalid", function() {
  let input = ["file1", "file2", "filex"];
  let fileChecker = { existsSync: (filePath) => input.includes(filePath) };

  it("should return false for valid files", function() {
    assert.equal(isFileInvalid("file1", fileChecker), false);
    assert.equal(isFileInvalid("filex", fileChecker), false);
  });

  it("should return true for invalid files", function() {
    assert.equal(isFileInvalid("fileY", fileChecker), true);
  });

});