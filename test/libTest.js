/* eslint-env mocha */

const assert = require("assert");

const {
  splitSource,
  extractFilenames,
  readFromTop,
  readFromBottom,
  getContents,
  arrangeContents,
  handleErrors,
  head,
  tail
} = require("../src/lib.js");

const dummyReader = (content) => content;

describe("splitSource", function() {

  describe("for new line as delimiter", function() {
    const delim = "\n";

    it("should return each line in array for given source, reader, delim in new line ", () => {
      let source = "abcdefgh\n";
      source += "ijklmnop\n";
      source += "qrstuvwxyz"; 
      let expectedOutput = ["abcdefgh", "ijklmnop", "qrstuvwxyz"];
      assert.deepStrictEqual(splitSource(source, dummyReader, delim), expectedOutput);
    });
  });

  describe("for empty string as delimiter", () => {
    const delim = "";

    it("should return each character in array for given source, reader, delim", () => {
      let source = "ABCD\nEFGH";
      let expectedOutput = ["A", "B", "C", "D", "\n", "E", "F", "G", "H"];
      assert.deepStrictEqual(splitSource(source, dummyReader, delim), expectedOutput);
    });
  });

});

describe("extractFilenames", function() {

  it("should return a blank array if no filePath is provided", function() {
    assert.deepStrictEqual(extractFilenames(["-n", "5"]), []);
  });

  it("should return an array of one filePath for one file provided", function() {
    let userInput = ["file1"];
    assert.deepStrictEqual(extractFilenames(userInput), ["file1"]);
    
    userInput = ["-n5", "file1"];
    assert.deepStrictEqual(extractFilenames(userInput), ["file1"]);

    userInput = ["-n", "5", "file1"];
    assert.deepStrictEqual(extractFilenames(userInput), ["file1"]);
  });

  it("should return an array of two filePaths for two file provided", function() {
    let userInput = ["file1", "file2"];
    assert.deepStrictEqual(extractFilenames(userInput), ["file1", "file2"]);

    userInput = ["-n", "5", "file1", "file2"];
    assert.deepStrictEqual(extractFilenames(userInput), ["file1", "file2"]);
  });

});

describe("readFromTop", function() {

  describe("for reading each line", () => {

    const delim = "\n";
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

    it("should return an empty array for number of lines provided is 0", function() {
      assert.deepStrictEqual(readFromTop(fileContents, dummyReader, 0, delim), "");
    });

    it("should return 10 lines in array for number of lines provided is 10 ", function() {

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

      assert.deepStrictEqual(readFromTop(fileContents, dummyReader, 10, delim), expectedOutput);
    });
  });

  describe("for reading each character", () => {

    const delim = "";
    const fileContents = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\n";

    it("should return an empty array for number of lines provided is 0", function() {
      assert.deepStrictEqual(readFromTop(fileContents, dummyReader, 0, delim), "");
    });

    it("should return 10 lines in array for number of lines provided is 10 ", function() {
      let expectedOutput = "A\nB\nC\nD\nE\n";
      assert.deepStrictEqual(readFromTop(fileContents, dummyReader, 10, delim), expectedOutput);
    });
  });
      
});

describe("readFromBottom", function() {

  describe("for reading each line", () => {

    const delim = "\n";
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

    it("should return an empty array for number of lines provided is 0", function() {
      assert.deepStrictEqual(readFromBottom(fileContents, dummyReader, 0, delim), "");
    });

    it("should return 10 lines form bottom in array for number of lines provided is 10 ", function() {

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

      assert.deepStrictEqual(readFromBottom(fileContents, dummyReader, 10, delim), expectedOutput);
    });
  });

  describe("for reading each character", () => {

    const delim = "";
    const fileContents = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\n";

    it("should return an empty array for number of lines provided is 0", function() {
      assert.deepStrictEqual(readFromBottom(fileContents, dummyReader, 0, delim), "");
    });

    it("should return 10 lines in array for number of lines provided is 10 ", function() {
      let expectedOutput = "H\nI\nJ\nK\nL\n";
      assert.deepStrictEqual(readFromBottom(fileContents, dummyReader, 10, delim), expectedOutput);
    });
  });
      
});

describe("getContents", function() {
  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const file2 = "a\nb\n";
  const listOfFiles = { file1, file2 };
  const reader = (filePath)=> listOfFiles[filePath];

  describe("for head operation", function() { 
    const operation = "head";
    let filePath = "file1";

    it("should return 10 lines from top if no option provided", function() {
      let parsedArgs = ["file1"];
      let expectedOutput =  "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ";
      assert.strictEqual(getContents(parsedArgs, filePath, reader, operation), expectedOutput);
    });

    it("should return 5 chars from top if option is character and count is 5", function() {
      let parsedArgs = ["-c5", "file1"];
      let expectedOutput = "A\nB\nC";
      assert.strictEqual(getContents(parsedArgs, filePath, reader, operation), expectedOutput);
    });
    
    it("should return 5 lines from top if option is line and count is 5", ()=>{
      let parsedArgs = ["-n5", "file1"];
      let expectedOutput = "A\nB\nC\nD\nE";
      assert.strictEqual(getContents(parsedArgs, filePath, reader, operation), expectedOutput);
    });

  });

  describe("for tail operation", function() {
    const operation = "tail";
    let filePath = "file1";

    it("should return 10 lines from top if no option provided", function() {
      let parsedArgs = ["file1"];
      let expectedOutput =  "D\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
      assert.strictEqual(getContents(parsedArgs, filePath, reader, operation), expectedOutput);
    });

    it("should return 5 chars from top if option is character and count is 5", function() {
      let parsedArgs = ["-c5", "file1"];
      let expectedOutput = "K\nL\nM";
      assert.strictEqual(getContents(parsedArgs, filePath, reader, operation), expectedOutput);
    });
  
    it("should return 5 lines from top if option is line and count is 5", ()=>{
      let parsedArgs = ["-n5", "file1"];
      let expectedOutput = "I\nJ\nK\nL\nM";
      assert.strictEqual(getContents(parsedArgs, filePath, reader, operation), expectedOutput);
    });

  });

});

describe("arrangeContents", function() {

  const file1 = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
  const file2 = "a\nb\n";
  const filex = "x";
  const listOfFiles = { file1, file2, filex };
  const fs = {
    readFileSync: (filePath) => listOfFiles[filePath],
    existsSync: (filePath) => Object.keys(listOfFiles).includes(filePath) 
  };

  describe("for head", function() {
    const operation = "head";

    it("should return invalid file message if the file doesnot exists", function() {
      let userInput = ["fileY"];
      let expectedOutput = "head: fileY: No such file or directory\n";
      assert.strictEqual(arrangeContents(userInput, fs, operation), expectedOutput);
    });

    it("should return file content if File exists", function() {
      let userInput = ["file1"];
      let expectedOutput = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);

      userInput = ["-n5", "file1"];
      expectedOutput = "A\nB\nC\nD\nE";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);

      userInput = ["-c5", "file1"];
      expectedOutput = "A\nB\nC";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);
    });

    it("should return invalid file message and file content if one file exists but other doesnot", () => {
      let userInput = ["-n5", "file1", "fileY"];
      let expectedOutput = "==> file1 <==\n";
      expectedOutput += "A\nB\nC\nD\nE\n";
      expectedOutput += "head: fileY: No such file or directory";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);
    });

  });

  describe("for tail", function() {
    const operation = "tail";

    it("should return invalid file message if the file doesnot exists", function() {
      let userInput = ["fileY"];
      let expectedOutput = "tail: fileY: No such file or directory\n";
      assert.strictEqual(arrangeContents(userInput, fs, operation), expectedOutput);
    });

    it("should return file content if File exists", function() {
      let userInput = ["file1"];
      let expectedOutput = "D\nE\nF\nG\nH\nI\nJ\nK\nL\nM";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);

      userInput = ["-n5", "file1"];
      expectedOutput = "I\nJ\nK\nL\nM";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);

      userInput = ["-c5", "file1"];
      expectedOutput = "K\nL\nM";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);
    });

    it("should return invalid file message and file content if one file exists but other doesnot", () => {
      let userInput = ["-n5", "file1", "fileY"];
      let expectedOutput = "==> file1 <==\n";
      expectedOutput += "I\nJ\nK\nL\nM" + "\n";
      expectedOutput += "tail: fileY: No such file or directory";
      assert.strictEqual(arrangeContents(userInput, fs, operation).trim(), expectedOutput);
    });

  });

});

describe("handleErrors", function() {

  describe("for head", function() {
    const errorMessage = "head: illegal option -- ";
    const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
    const invalidLineCount = "head: illegal line count -- ";
    const invalidByteCount = "head: illegal byte count -- ";

    it("should return false for valid options", function() {
      assert.strictEqual(handleErrors(["file1"], "head"), false);
      assert.strictEqual(handleErrors(["--", "file1"], "head"), false);
      assert.strictEqual(handleErrors(["-5", "file1"], "head"), false);
      assert.strictEqual(handleErrors(["-n5", "file1"], "head"), false);
      assert.strictEqual(handleErrors(["-c5", "file1"], "head"), false);
    });

    it("should return error & usage message for given invalid option", function() {
      let userArgs = ["-x5", "file1"];
      let expectedOutput = errorMessage + "x" + "\n" + usageMessage;
      assert.strictEqual(handleErrors(userArgs, "head"), expectedOutput);
    });

    it("should return invalid line message for given invalid line count", function() {
      let userArgs = ["-n0", "file1"];
      let expectedOutput = invalidLineCount + "0";
      assert.strictEqual(handleErrors(userArgs, "head"), expectedOutput);
    });

    it("should return invalid byte message for given invalid byte count", function() {
      let userArgs = ["-c0", "file1"];
      let expectedOutput = invalidByteCount + "0";
      assert.strictEqual(handleErrors(userArgs, "head"), expectedOutput);
    });

  });

  describe("for tail", function() {
    const errorMessage = "tail: illegal option -- ";
    const usageMessage = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 
    const invalidOffsetMsg = "tail: illegal offset -- ";

    it("should return false for valid options", function() {
      assert.strictEqual(handleErrors(["file1"], "tail"), false);
      assert.strictEqual(handleErrors(["--", "file1"], "tail"), false);
      assert.strictEqual(handleErrors(["-5", "file1"], "tail"), false);
      assert.strictEqual(handleErrors(["-n5", "file1"], "tail"), false);
      assert.strictEqual(handleErrors(["-c5", "file1"], "tail"), false);
    });

    it("should return error & usage message for invalid option", function() {
      let userArgs = ["-x5", "file1"];
      let expectedOutput = errorMessage + "x" + "\n" + usageMessage;
      assert.strictEqual(handleErrors(userArgs, "tail"), expectedOutput);
    });

    it("should return invalid offset message for count 0", function() {
      let userArgs = ["-n0", "file1"];
      assert.strictEqual(handleErrors(userArgs, "tail"), "");
    });

    it("should return invalid offset message for invalid count", function() {
      let userArgs = ["-c10x", "file1"];
      let expectedOutput = invalidOffsetMsg + "10x";
      assert.strictEqual(handleErrors(userArgs, "tail"), expectedOutput);
    });

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
    let userInput = ["-a", "file1"];
    let expectedOutput = errorMessage + "a" + "\n" + usageMessage;
    assert.strictEqual(head(userInput, fs), expectedOutput);
  });

  it("should return illegal count message for invalid count given", function() {
    let userInput = ["-n0", "file1"];
    let expectedOutput = invalidLineCount + "0";
    assert.strictEqual(head(userInput, fs), expectedOutput);

    userInput = ["-c0", "file1"];
    expectedOutput = invalidByteCount + "0";
    assert.strictEqual(head(userInput, fs), expectedOutput);
  });

  it("should return contents of file if correct input is given", function() {
    let userInput = ["-n5", "file1"];
    let expectedOutput = "A\nB\nC\nD\nE";
    assert.strictEqual(head(userInput, fs).trim(), expectedOutput);
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
    let userInput = ["-a", "file1"];
    let expectedOutput = errorMessage + "a" + "\n" + usageMessage;
    assert.strictEqual(tail(userInput, fs), expectedOutput);
  });

  it("should return empty string if count is 0", function() {
    let userInput = ["-n0", "file1"];
    assert.strictEqual(tail(userInput, fs).trim(), "");
  });

  it("should return contents of file if correct input is given", function() {
    let userInput = ["-n5", "file1"];
    let expectedOutput = "I\nJ\nK\nL\nM";
    assert.strictEqual(tail(userInput, fs), expectedOutput);
  });

  it("should return invalid offset if invalid count is given", function() {
    let userInput =["-n10x", "file1"];
    let expectedOutput = invalidOffsetMsg + "10x";
    assert.strictEqual(tail(userInput, fs), expectedOutput) ;

    userInput =["-n2.5", "file1"];
    expectedOutput = invalidOffsetMsg + "2.5";
    assert.strictEqual(tail(userInput, fs), expectedOutput) ;
  });

});
