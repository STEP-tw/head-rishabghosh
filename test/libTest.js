/* eslint-env mocha */
/*jshint -W061 */

const assert = require("assert");

const {
  isOptionLine,
  isOptionChar,
  isFileInvalid,
  splitByLine,
  splitByChar,
  extractCountAndStartingIndex,
  readLinesFromTop,
  extractFilenames,
  getContentsOfHead,
  handleHeadErrors,
  head,
  readLinesFromBottom,
  readCharFromBottom,
  getContentsOfTail,
  tail
} = require("../src/lib.js");

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

  it("should reutrn true if first argument is a possible filename", function() {
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

  describe("for count provided as firstArg", function() {
    it("should return a object where linesToShow is the count provided", function() {
      let input = ["n", "h.js", "-5", "file1"];
      let expectedOutput = { linesToShow: 5, charToShow: 0, startingIndex: 3 };
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
  let fileChecker = { existsSync: (filename) => input.includes(filename) };

  it("should return false for valid files", function() {
    assert.equal(isFileInvalid("file1", fileChecker), false);
    assert.equal(isFileInvalid("filex", fileChecker), false);
  });

  it("should return true for invalid files", function() {
    assert.equal(isFileInvalid("fileY", fileChecker), true);
  });

});

describe("getContentsOfHead", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\n";
  const listOfFiles = ["file1", "file2", "filex"];
  const fs = {
    readFileSync: (filename) => eval(filename),
    existsSync: (filename) => listOfFiles.includes(filename)
  };

  it("should return invalidFileMsg if the file doesnot exists", function() {
    let userInput = ["n", "head.js", "fileY"];
    let expectedOutput = "head: fileY: No such file or directory\n";
    assert.equal(getContentsOfHead(userInput, fs), expectedOutput);
  });

  it("should return fileContent if File exists", function() {
    let userInput = ["n", "head.js", "file1"];
    let expectedOutput = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ";
    assert.equal(getContentsOfHead(userInput, fs).trim(), expectedOutput);

    userInput = ["n", "head.js", "-n5", "file1"];
    expectedOutput = "A\nB\nC\nD\nE";
    assert.equal(getContentsOfHead(userInput, fs).trim(), expectedOutput);

    userInput = ["n", "head.js", "-c5", "file1"];
    expectedOutput = "A\nB\nC";
    assert.equal(getContentsOfHead(userInput, fs).trim(), expectedOutput);
  });

  it("should return invalidFileMsg and fileContent if one file exists but other doesnot", () => {
    let userInput = ["n", "head.js", "-n5", "file1", "fileY"];
    let expectedOutput = "==> file1 <==\n";
    expectedOutput += "A\nB\nC\nD\nE\n\n";
    expectedOutput += "head: fileY: No such file or directory";
    assert.equal(getContentsOfHead(userInput, fs).trim(), expectedOutput);
  });

});

describe("handleHeadErrors", function() {
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";

  it("should return false for input [,,\"file1\"]", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "file1"]), false);
  });

  it("should return false for input [,,\"--\", \"file1\"]", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "--", "file1"]), false);
  });

  it("should return false for input [,,\"-n5\", \"file1\"]", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-n5", "file1"]), false);
  });

  it("should return false for input [,, \"-n\", \"5\", \"file1\"]", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-n", "5", "file1"]), false);
  });

  it("should return false for input [,, \"-c5\", \"file1\"]", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-c5", "file1"]), false);
  });

  it("should return false for input [,, \"-c\" \"5\", \"file1\"]", function() {
    assert.equal(handleHeadErrors(["n", "head.js", "-c", "5", "file1"]), false);
  });

  it("should return error & usage message for input [,, \"-x5\", \"file1\"]", function() {
    let input = ["n", "head.js", "-x5", "file1"];
    let expectedOutput = errorMessage + input[2][1] + "\n" + usageMessage;
    assert.equal(handleHeadErrors(input), expectedOutput);
  });

  it("should return invalid line message for input [,,\"-n0\", \"file1\"]", function() {
    let input = ["n", "head.js", "-n0", "file1"];
    let expectedOutput = invalidLineCount + input[2].slice(2);
    assert.equal(handleHeadErrors(input), expectedOutput);
  });

  it("should return invalid byte message for input [,,\"-c0\", \"file1\"]", function() {
    let input = ["n", "head.js", "-c0", "file1"];
    let expectedOutput = invalidByteCount + input[2].slice(2);
    assert.equal(handleHeadErrors(input), expectedOutput);
  });

});

describe("head", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\n";
  const listOfFiles = ["file1", "file2", "filex"];
  const fs = {
    readFileSync: (filename) => eval(filename),
    existsSync: (filename) => listOfFiles.includes(filename)
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

});

describe("extractFilenames", function() {

  it("should return a blank array if no filename is provided", function() {
    assert.deepEqual(extractFilenames(["n", "h", "-n", "5"]), []);
  });

  it("should return an array of one filename for one file provided", function() {
    let userInput = ["n", "h", "file1"];
    assert.deepEqual(extractFilenames(userInput), ["file1"]);
    
    userInput = ["n", "h", "-n5", "file1"];
    assert.deepEqual(extractFilenames(userInput), ["file1"]);

    userInput = ["n", "h", "-n", "5", "file1"];
    assert.deepEqual(extractFilenames(userInput), ["file1"]);
  });

  it("should return an array of two filenames for two file provided", function() {
    let userInput = ["n", "h", "file1", "file2"];
    assert.deepEqual(extractFilenames(userInput), ["file1", "file2"]);

    userInput = ["n", "h", "-n", "5", "file1", "file2"];
    assert.deepEqual(extractFilenames(userInput), ["file1", "file2"]);
  });

});

describe("getContentesOfTail", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const listOfFiles = ["file1", "file2", "filex"];
  const fs = {
    readFileSync: (filename) => eval(filename),
    existsSync: (filename) => listOfFiles.includes(filename)
  };

  it("should return invalidFileMsg if the file doesnot exist", function() {
    let userInput = ["n", "tail.js", "fileY"];
    let expectedOutput = "tail: fileY: No such file or directory";
    assert.equal(getContentsOfTail(userInput, fs).trim(), expectedOutput);
  });

  it("should return fileContent if File exists", function() {
    let userInput = ["n", "tail.js", "file1"];
    let expectedOutput = "D\nE\nF\nG\nH\nI\nJ\nK\nL\nM\n";
    assert.equal(getContentsOfTail(userInput, fs), expectedOutput);

    userInput = ["n", "tail.js", "-n5", "file1"];
    expectedOutput = "I\nJ\nK\nL\nM\n"; 
    assert.equal(getContentsOfTail(userInput, fs), expectedOutput);

    userInput = ["n", "tail.js", "-c5", "file1"];
    expectedOutput = "K\nL\nM";
    assert.equal(getContentsOfTail(userInput, fs).trim(), expectedOutput);

  });

  it("should return invalidFileMsg and fileContent if one file exists but other doesnot", () => {
    let userInput = ["n", "tail.js", "-n5", "file1", "fileY"];
    let expectedOutput = "==> file1 <==\n";
    expectedOutput += "I\nJ\nK\nL\nM\n"; 
    expectedOutput += "tail: fileY: No such file or directory";
    assert.equal(getContentsOfTail(userInput, fs).trim(), expectedOutput);
  });

});

describe("tail", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\n";
  const listOfFiles = ["file1", "file2", "filex"];
  const fs = {
    readFileSync: (filename) => eval(filename),
    existsSync: (filename) => listOfFiles.includes(filename)
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
    let expectedOutput = "J\nK\nL\nM\n\n";
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
