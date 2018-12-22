/* eslint-env mocha */
const assert = require("assert");

const {
  isOptionLine,
  isOptionChar,
  splitByLine,
  splitByChar,
  splitSource1,
  isFileInvalid,
} = require("../src/util.js");

const dummyReader = (content) => content;

describe("isOptionLine", function() {

  it("should return true for \"n\" given as first argument", function() {
    let userInput = "n";
    assert.equal(isOptionLine(userInput), true);
  });
  
  it("should return false if option is invalid", function() {
    let userInput = "a";
    assert.equal(isOptionLine(userInput), false);
  });
  
  it("should return false for \"c\" given as option", function() {
    let userInput = "c";
    assert.equal(isOptionLine(userInput), false);
  });
  
});
  
describe("isOptionChar", function() {
  
  it("should return true for \"c\" as first argument", function() {
    let userInput = "c";
    assert.equal(isOptionChar(userInput), true);
  });
  
  it("should return false for \"n\" as first argument", function() {
    let userInput = "n";
    assert.equal(isOptionChar(userInput), false);
  });
  
  it("should return false for every other input than \"c\"", function() {
    let userInput = "a";
    assert.equal(isOptionChar(userInput), false);
  
    userInput = "5";
    assert.equal(isOptionChar(userInput), false);
  
    userInput = "head.js";
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

describe("splitSource", function() {

  describe("for new line as delimiter", function() {
    const delim = "\n";
    it("should return each line in array for given source, reader, delim in new line ", () => {
      let source = "abcdefgh\n";
      source += "ijklmnop\n";
      source += "qrstuvwxyz"; 
      let expectedOutput = ["abcdefgh", "ijklmnop", "qrstuvwxyz"];

      assert.deepStrictEqual(splitSource1(source, dummyReader, delim), expectedOutput);
    });
  });

  describe("for empty string as delimiter", () => {
    const delim = "";

    it("should return each character in array for given source, reader, delim", () => {
      let source = "ABCD\nEFGH";
      let expectedOutput = ["A", "B", "C", "D", "\n", "E", "F", "G", "H"];
      assert.deepStrictEqual(splitSource1(source, dummyReader, delim), expectedOutput);
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