/* eslint-env mocha */

const assert = require("assert");

const {
  isTypeLine,
  isTypeChar,
  isFileInvalid,
  splitLine,
  extractCountAndStartingIndex,
  sliceElements,
  readLinesFromTop,
  getContents,
  ifErrorOccurs
} = require("../src/lib.js");

const dummyReader = (content) => content;

describe("isTypeLine", function() {

  it("should return true for \"-n\" given as first argument", function() {
    let userInput = ["n", "head.js", "-n", "5", "file1"];
    assert.equal(isTypeLine(userInput), true);

    userInput = ["n", "head.js", "-n5", "file1"];
    assert.equal(isTypeLine(userInput), true);
  });

  it("should return true for \"--\" given as first argument", function() {
    let userInput = ["n", "head.js", "--", "5", "file1"];
    assert.equal(isTypeLine(userInput), true);
  });

  it("should return true if first argument is a integer", function() {
    let userInput = ["n", "head.js", "-5", "file1"];
    assert.equal(isTypeLine(userInput), true);
  });

  it("should reutrn true if first argument is a possible filename", function() {
    let userInput = ["n", "head.js", "5"];
    assert.equal(isTypeLine(userInput), true);
    
    userInput = ["n", "head.js", "file1"];
    assert.equal(isTypeLine(userInput), true);
  });

  it("should return false if first  argument is invalid", function() {
    let userInput = ["n", "head.js", "-a", "file1"];
    assert.equal(isTypeLine(userInput), false);

    userInput = ["n", "head.js", "-r", "file1"];
    assert.equal(isTypeLine(userInput), false);
  });

  it("should return false for \"-c\" given as first argument", function() {
    let userInput = ["n", "head.js", "-c", "file1"];
    assert.equal(isTypeLine(userInput), false);
  });

});

describe("isTypeChar", function() {

  it("should return true for \"-c\" as first argument", function() {
    let userInput = ["n", "head.js", "-c", "file1"];
    assert.equal(isTypeChar(userInput), true);
  });
  
  it("should return false for \"-n\" as first argument", function() {
    let userInput = ["n", "head.js", "-n", "file1"];
    assert.equal(isTypeChar(userInput), false);
  });

  it("should return false for every other input than \"-c\"", function() {
    let userInput = ["n", "head.js", "-a", "file1"];
    assert.equal(isTypeChar(userInput), false);

    userInput = ["n", "head.js", "-5", "file1"];
    assert.equal(isTypeChar(userInput), false);

    userInput = ["n", "head.js", "file1"];
    assert.equal(isTypeChar(userInput), false);
  });

});

describe("splitLine", function() {

  describe("for given a source and a reader", function() {
    it("should return content/s of source in array splited by \"\n\" ", function() {

      let input = "abcdefgh\n";
      input += "ijklmnop\n";
      input += "qrstuvwxyz";

      let expectedOutput = ["abcdefgh", "ijklmnop", "qrstuvwxyz"];
      assert.deepEqual(splitLine(input, dummyReader), expectedOutput);
    });
  });

});

describe("extractCountAndStartingIndex", function() {

  describe("for no count value given", function() {
    it("should return a object containing linesToShow: 10, startingIndex: 2", function() {
      let input = ["n", "h.js", "file1"];
      let expectedOutput = { linesToShow: 10, charToShow: 0, startingIndex: 2 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for multiple files and no count value given", function() {
    it("should return a object containing linesToShow: 10, startingIndex: 2", function() {
      let input = ["n", "h.js", "file1", "file2"];
      let expectedOutput = { linesToShow: 10, charToShow: 0, startingIndex: 2 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });


  describe("for input ['n', 'head.js', \"-n5\", \"file1\"]", function() {
    it("should return a object containing linesToShow: 5, startingIndex: 3", function() {
      let input = ["n", "h.js", "-n5", "file1"];
      let expectedOutput = { linesToShow: 5, charToShow: 0, startingIndex: 3 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });

  });

  describe("for input [,, \"-n4\", \"file1\"]", function() {
    it("should return a object containing linesToShow: 4, startingIndex: 3", function() {
      let input = ["n", "h.js", "-n4", "file1"];
      let expectedOutput = { linesToShow: 4, charToShow: 0, startingIndex: 3 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for count 7  provied in 3rd index", function() {
    it("should return a object containing linesToShow: 7, startingIndex: 4", function() {
      let input = ["n", "h.js", "-n", "7", "file1"];
      let expectedOutput = { linesToShow: 7, charToShow: 0, startingIndex: 4 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

});


describe("sliceElements", function() {

  describe("for noOfElements 0", function() {
    it("should return blank array", function() {
      let input = [1, 2, 3, "a", "b"];
      assert.deepEqual(sliceElements(input, 0), []);
    });
  });

  describe("for noOfElements 10", function() {
    it("should return first 10 elements", function() {
      let input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      assert.deepEqual(sliceElements(input, 10), expectedOutput);
    });
  });

});


describe("readLinesFromTop", function() {

  let fileContents = "";
  fileContents += "This is line 1\n";
  fileContents += "This is line 2\n";
  fileContents += "This is line 3\n";
  fileContents += "This is line 4\n";
  fileContents += "This is line 5\n";
  fileContents += "This is line 6\n";
  fileContents += "This is line 7\n";
  fileContents += "This is line 8\n";
  fileContents += "This is line 9\n";
  fileContents += "This is line 10\n";
  fileContents += "This is line 11";

  it("should return an empty array for noOfLines:0", function() {
    assert.deepEqual(readLinesFromTop(fileContents, dummyReader, 0), "");
  });

  it("should return 10 lines in array for noOfLines:10 ", function() {

    let expectedOutput = "";
    expectedOutput += "This is line 1\n";
    expectedOutput += "This is line 2\n";
    expectedOutput += "This is line 3\n";
    expectedOutput += "This is line 4\n";
    expectedOutput += "This is line 5\n";
    expectedOutput += "This is line 6\n";
    expectedOutput += "This is line 7\n";
    expectedOutput += "This is line 8\n";
    expectedOutput += "This is line 9\n";
    expectedOutput += "This is line 10";

    assert.deepEqual(readLinesFromTop(fileContents, dummyReader, 10), expectedOutput);
  });

});

describe("isFileInvalid", function() {
  let input = ["file1", "file2", "filex"];
  let fileChecker = {existsSync : (filename)=> input.includes(filename)};

  it("should return false for valid files", function() {
    assert.equal(isFileInvalid("file1", fileChecker), false);
    assert.equal(isFileInvalid("filex", fileChecker), false);
  });

  it("should return true for invalid files", function() {
    assert.equal(isFileInvalid("fileY", fileChecker), true);
  });

});

describe("getContents", function() {

  let listOfFiles = ["file1", "file2", "filex"];
  const fs = {readFileSync : dummyReader,
    existsSync: (filename)=> listOfFiles.includes(filename)};

  it("should return invalidFileMsg if the file doesnot exists", function() {
    let userInput = ["n", "head.js", "fileY"];
    let expectedOutput = "head: fileY: No such file or directory\n"; 
    assert.equal(getContents(userInput, fs), expectedOutput);
  });

});

describe("ifErrorOccurs", function() {
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";

  it("should return false for input [,,\"file1\"]", function() {
    assert.equal(ifErrorOccurs(["n", "head.js", "file1"]), false);
  });

  it("should return false for input [,,\"--\", \"file1\"]", function() {
    assert.equal(ifErrorOccurs(["n", "head.js", "--", "file1"]), false);
  });

  it("should return false for input [,,\"-n5\", \"file1\"]", function() {
    assert.equal(ifErrorOccurs(["n", "head.js", "-n5", "file1"]), false);
  });

  it("should return false for input [,, \"-n\", \"5\", \"file1\"]", function() {
    assert.equal(ifErrorOccurs(["n", "head.js", "-n", "5", "file1"]), false);
  });

  it("should return false for input [,, \"-c5\", \"file1\"]", function() {
    assert.equal(ifErrorOccurs(["n", "head.js", "-c5", "file1"]), false);
  });

  it("should return false for input [,, \"-c\" \"5\", \"file1\"]", function() {
    assert.equal(ifErrorOccurs(["n", "head.js", "-c", "5", "file1"]), false);
  });

  it("should return error & usage message for input [,, \"-x5\", \"file1\"]", function() {
    let input = ["n", "head.js", "-x5", "file1"];
    let expectedOutput = errorMessage + input[2][1] + "\n" + usageMessage;
    assert.equal(ifErrorOccurs(input), expectedOutput);
  });

  it("should return invalid line message for input [,,\"-n0\", \"file1\"]", function() {
    let input = ["n", "head.js", "-n0", "file1"];
    let expectedOutput = invalidLineCount + input[2].slice(2);
    assert.equal(ifErrorOccurs(input), expectedOutput);
  });

  it("should return invalid byte message for input [,,\"-c0\", \"file1\"]", function() {
    let input = ["n", "head.js", "-c0", "file1"];
    let expectedOutput = invalidByteCount + input[2].slice(2);
    assert.equal(ifErrorOccurs(input), expectedOutput);
  });


});
