/* eslint-env mocha */

const assert = require("assert");

const {
  extractCountAndStartingIndex,
  readLinesFromTop,
  extractFilenames,
  arrangeContentsOfHead,
  handleHeadErrors,
  head,
  readLinesFromBottom,
  readCharFromBottom,
  arrangeContentsOfTail,
  handleTailErrors,
  tail
} = require("../src/lib.js");

const dummyReader = (content) => content;

describe("extractCountAndStartingIndex", function() {

  describe("for no count value given", function() {
    it("should return line count of 10 & starting index of 0 in a object", function() {
      let input = ["file1"];
      let expectedOutput = { lineCount: 10, charCount: 0, startingIndex: 0 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for multiple files and no count value given", function() {
    it("should return line count of 10 & starting index of 0 in a object", function() {
      let input = ["file1", "file2"];
      let expectedOutput = { lineCount: 10, charCount: 0, startingIndex: 0 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });


  describe("for given line count 5 in  0th index", function() {
    it("should return line count of 5 & starting index of 1 in a object", function() {
      let input = ["-n5", "file1"];
      let expectedOutput = { lineCount: 5, charCount: 0, startingIndex: 1 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });

  });

  describe("for given line count 4 in 0th index", function() {
    it("should return line count of 4 & starting index of 1 in a object", function() {
      let input = ["-n4", "file1"];
      let expectedOutput = { lineCount: 4, charCount: 0, startingIndex: 1 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for line count 7  provied in 1st index", function() {
    it("should return line count of 7 & starting index of 2 in a object", function() {
      let input = ["-n", "7", "file1"];
      let expectedOutput = { lineCount: 7, charCount: 0, startingIndex: 2 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for count provided as firstArg", function() {
    it("should return line count of 5 & starting index of 1 in a object", function() {
      let input = ["-5", "file1"];
      let expectedOutput = { lineCount: 5, charCount: 0, startingIndex: 1 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
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

  it("should return an empty array for no of lines is 0", function() {
    assert.deepEqual(readLinesFromTop(fileContents, dummyReader, 0), "");
  });

  it("should return 10 lines in array for no of lines is 10 ", function() {

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

describe("arrangeContentsOfHead", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const file2 = "a\nb\n";
  const filex = "x";
  const listOfFiles = { file1, file2, filex };
  const fs = {
    readFileSync: (filePath) => listOfFiles[filePath],
    existsSync: (filePath) => Object.keys(listOfFiles).includes(filePath) 
  };

  it("should return invalid file message if the file doesnot exists", function() {
    let userInput = ["n", "head.js", "fileY"];
    let expectedOutput = "head: fileY: No such file or directory\n";
    assert.equal(arrangeContentsOfHead(userInput, fs), expectedOutput);
  });

  it("should return file content if File exists", function() {
    let userInput = ["n", "head.js", "file1"];
    let expectedOutput = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ";
    assert.equal(arrangeContentsOfHead(userInput, fs).trim(), expectedOutput);

    userInput = ["n", "head.js", "-n5", "file1"];
    expectedOutput = "A\nB\nC\nD\nE";
    assert.equal(arrangeContentsOfHead(userInput, fs).trim(), expectedOutput);

    userInput = ["n", "head.js", "-c5", "file1"];
    expectedOutput = "A\nB\nC";
    assert.equal(arrangeContentsOfHead(userInput, fs).trim(), expectedOutput);
  });

  describe("if one file exists but other doesnot", function() {
    it("should return invalid file message and file content", () => {
      let userInput = ["n", "head.js", "-n5", "file1", "fileY"];
      let expectedOutput = "==> file1 <==\n";
      expectedOutput += "A\nB\nC\nD\nE\n\n";
      expectedOutput += "head: fileY: No such file or directory";
      assert.equal(arrangeContentsOfHead(userInput, fs).trim(), expectedOutput);
    });
  });

});

describe("handleHeadErrors", function() {
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";

  it("should return false for default option(no option)", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "file1"]), false);
  });

  it("should return false for option \"--\"", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "--", "file1"]), false);
  });

  it("should return false for option \"-n5\"", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-n5", "file1"]), false);
  });

  it("should return false for first option \"-n\", 2nd- \"5\"", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-n", "5", "file1"]), false);
  });

  it("should return false for option \"-c5\"", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-c5", "file1"]), false);
  });

  it("should return false for first option \"-c\", 2nd- \"5\"", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-c", "5", "file1"]), false);
  });

  it("should return error & usage message for given invalid option", function() {
    let input = ["n", "head.js", "-x5", "file1"];
    let expectedOutput = errorMessage + input[2][1] + "\n" + usageMessage;
    assert.equal(handleHeadErrors(input), expectedOutput);
  });

  it("should return invalid line message for given invalid line count", function() {
    let input = ["n", "head.js", "-n0", "file1"];
    let expectedOutput = invalidLineCount + input[2].slice(2);
    assert.equal(handleHeadErrors(input), expectedOutput);
  });

  it("should return invalid byte message for given invalid byte count", function() {
    let input = ["n", "head.js", "-c0", "file1"];
    let expectedOutput = invalidByteCount + input[2].slice(2);
    assert.equal(handleHeadErrors(input), expectedOutput);
  });

});

describe("head", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const file2 = "a\nb\n";
  const filex = "x";
  const listOfFiles = { file1, file2, filex };
  const fs = {
    readFileSync: (filePath) => listOfFiles[filePath],
    existsSync: (filePath) => Object.keys(listOfFiles).includes(filePath) 
  };

  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- "; 

  it("should return error message if illegal option is given", function() {
    let userInput = ["n", "head.js", "-a", "file1"];
    let expectedOutput = errorMessage + "a" + "\n" + usageMessage;
    assert.equal(head(userInput, fs), expectedOutput);
  });

  it("should return illegal count message for invalid count given", function() {
    let userInput = ["n", "head.js", "-n0", "file1"];
    let expectedOutput = invalidLineCount + "0";
    assert.equal(head(userInput, fs), expectedOutput);

    userInput = ["n", "head.js", "-c0", "file1"];
    expectedOutput = invalidByteCount + "0";
    assert.equal(head(userInput, fs), expectedOutput);
  });

  it("should return contents of file if correct input is given", function() {
    let userInput = ["n", "head.js", "-n5", "file1"];
    let expectedOutput = "A\nB\nC\nD\nE";
    assert.equal(head(userInput, fs).trim(), expectedOutput);
  });
});

describe("readLinesFromBottom", function() {

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
    assert.deepEqual(readLinesFromBottom(fileContents, dummyReader, 0), "");
  });

  it("should return 10 lines in array for noOfLines:10 ", function() {

    let expectedOutput = "";
    expectedOutput += "This is line 2\n";
    expectedOutput += "This is line 3\n";
    expectedOutput += "This is line 4\n";
    expectedOutput += "This is line 5\n";
    expectedOutput += "This is line 6\n";
    expectedOutput += "This is line 7\n";
    expectedOutput += "This is line 8\n";
    expectedOutput += "This is line 9\n";
    expectedOutput += "This is line 10\n";
    expectedOutput += "This is line 11";

    assert.deepEqual(readLinesFromBottom(fileContents, dummyReader, 10), expectedOutput);
  });

  it("should return contents of entire file if noOfLines is greater than 11", function() {

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
    expectedOutput += "This is line 10\n";
    expectedOutput += "This is line 11";

    assert.deepEqual(readLinesFromBottom(fileContents, dummyReader, 15), expectedOutput);
  }); 

});

describe("readCharFromBottom", function() {

  let fileContents = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\n";

  it("should return an empty array for noOfchar:0", function() {
    assert.deepEqual(readCharFromBottom(fileContents, dummyReader, 0), "");
  });

  it("should return last 10 characters for noOfChar:10", function() {
    let expectedOutput = "H\nI\nJ\nK\nL\n";
    assert.deepEqual(readCharFromBottom(fileContents, dummyReader, 10), expectedOutput);
  });

  it("should return contents of entire file if noOfChar is greater than 24",function(){
    let expectedOutput = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\n";
    assert.deepEqual(readCharFromBottom(fileContents, dummyReader, 25), expectedOutput);
  });

});

describe("extractFilenames", function() {

  it("should return a blank array if no filePath is provided", function() {
    assert.deepEqual(extractFilenames(["-n", "5"]), []);
  });

  it("should return an array of one filePath for one file provided", function() {
    let userInput = ["file1"];
    assert.deepEqual(extractFilenames(userInput), ["file1"]);
    
    userInput = ["-n5", "file1"];
    assert.deepEqual(extractFilenames(userInput), ["file1"]);

    userInput = ["-n", "5", "file1"];
    assert.deepEqual(extractFilenames(userInput), ["file1"]);
  });

  it("should return an array of two filePaths for two file provided", function() {
    let userInput = ["file1", "file2"];
    assert.deepEqual(extractFilenames(userInput), ["file1", "file2"]);

    userInput = ["-n", "5", "file1", "file2"];
    assert.deepEqual(extractFilenames(userInput), ["file1", "file2"]);
  });

});

describe("getContentesOfTail", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const file2 = "a\nb\n";
  const filex = "x";
  const listOfFiles = { file1, file2, filex };
  const fs = {
    readFileSync: (filePath) => listOfFiles[filePath],
    existsSync: (filePath) => Object.keys(listOfFiles).includes(filePath) 
  };

  it("should return invalid file message if the file doesnot exist", function() {
    let userInput = ["n", "tail.js", "fileY"];
    let expectedOutput = "tail: fileY: No such file or directory";
    assert.equal(arrangeContentsOfTail(userInput, fs).trim(), expectedOutput);
  });

  it("should return content of file if File exists", function() {
    let userInput = ["n", "tail.js", "file1"];
    let expectedOutput = "D\nE\nF\nG\nH\nI\nJ\nK\nL\nM\n";
    assert.equal(arrangeContentsOfTail(userInput, fs), expectedOutput);

    userInput = ["n", "tail.js", "-n5", "file1"];
    expectedOutput = "I\nJ\nK\nL\nM\n"; 
    assert.equal(arrangeContentsOfTail(userInput, fs), expectedOutput);

    userInput = ["n", "tail.js", "-c5", "file1"];
    expectedOutput = "K\nL\nM";
    assert.equal(arrangeContentsOfTail(userInput, fs).trim(), expectedOutput);

  });
  describe("if one file exists but other doesnot", function () {
    it("should return invalid file message and content of file", function() {
      let userInput = ["n", "tail.js", "-n5", "file1", "fileY"];
      let expectedOutput = "==> file1 <==\n";
      expectedOutput += "I\nJ\nK\nL\nM\n"; 
      expectedOutput += "tail: fileY: No such file or directory";
      assert.equal(arrangeContentsOfTail(userInput, fs).trim(), expectedOutput);
    });
  });

});

describe("handleTailErrors", function() {
  const illegalOptionMessage = "tail: illegal option -- ";
  const usageMessage = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
  const illegalOffsetMessage = "tail: illegal offset -- ";

  it("should return illegal option message for illegal option", function() {
    let userInput = ["n", "tail.js", "-a0", "file1"];
    let expectedOutput = illegalOptionMessage + "a" + "\n" + usageMessage;
    assert.equal(handleTailErrors(userInput), expectedOutput);
  });

  it("should return illegal offset message for illegal byte count", function() {
    let userInput = ["n", "tail.js", "-c10x", "file1"];
    let expectedOutput = illegalOffsetMessage + "10x";
    assert.equal(handleTailErrors(userInput), expectedOutput);
  });

  it("should return illegal offset message for illegal line count", function() {
    let userInput = ["n", "tail.js", "-n10x", "file1"];
    let expectedOutput = illegalOffsetMessage + "10x";
    assert.equal(handleTailErrors(userInput), expectedOutput);
  });

  it("should return false if first option doesnt start with '-'", function() {
    let userInput = ["n", "tail.js", "file1"];
    assert.equal(handleTailErrors(userInput), false);
  });

});

describe("tail", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const file2 = "a\nb\n";
  const filex = "x";
  const listOfFiles = { file1, file2, filex };
  const fs = {
    readFileSync: (filePath) => listOfFiles[filePath],
    existsSync: (filePath) => Object.keys(listOfFiles).includes(filePath) 
  };

  const errorMessage = "tail: illegal option -- ";
  const usageMessage = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
  const invalidOffsetMsg = "tail: illegal offset -- ";

  it("should return error message if illegal option is given", function() {
    let userInput = ["n", "tail.js", "-a", "file1"];
    let expectedOutput = errorMessage + "a" + "\n" + usageMessage;
    assert.equal(tail(userInput, fs), expectedOutput);
  });

  it("should return empty string if count is 0", function() {
    let userInput = ["n", "tail.js", "-n0", "file1"];
    assert.equal(tail(userInput, fs).trim(), "");
  });

  it("should return contents of file if correct input is given", function() {
    let userInput = ["n", "tail.js", "-n5", "file1"];
    let expectedOutput = "I\nJ\nK\nL\nM\n";
    assert.equal(tail(userInput, fs), expectedOutput);
  });

  it("should return invalid offset if invalid count is given", function() {
    let userInput =["n", "tail.js", "-n10x", "file1"];
    let expectedOutput = invalidOffsetMsg + userInput[2].slice(2);
    assert.equal(tail(userInput, fs), expectedOutput) ;

    userInput =["n", "tail.js", "-n10x", "file1"];
    expectedOutput = invalidOffsetMsg + userInput[2].slice(2);
    assert.equal(tail(userInput, fs), expectedOutput) ;
  });

});
