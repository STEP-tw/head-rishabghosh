/* eslint-env mocha */

const assert = require("assert");

const {
  readFile,
  extractCountAndStartingIndex,
  sliceElements,
  readLinesFromTop,
  head
} = require("../src/lib.js");

const dummyReader = (content)=>content; 

describe("readFile", function(){
   
  describe("for given a source and a reader", function() {
    it("should return content/s of source in array splited by \"\n\" ", function() {
      
      let input = "abcdefgh\n";
      input += "ijklmnop\n";
      input += "qrstuvwxyz";
      
      let expectedOutput = [ "abcdefgh", "ijklmnop", "qrstuvwxyz" ];
      assert.deepEqual(readFile(input, dummyReader), expectedOutput);
    });
  });

});

describe("extractCountAndStartingIndex", function() {

  describe("for no count value given", function() {
    it("should return a object containing linesToShow: 10, startingIndex: 2", function() {
      let input = ["n", "h.js", "file1"];
      let expectedOutput = { linesToShow: 10, startingIndex: 2 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for multiple files and no count value given", function() {
    it("should return a object containing linesToShow: 10, startingIndex: 2", function() {
      let input = ["n", "h.js", "file1", "file2"];
      let expectedOutput = { linesToShow: 10, startingIndex: 2 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });


  describe("for input [, , \"-n5\", \"file1\"]", function() {
    it("should return a object containing linesToShow: 5, startingIndex: 3", function() {
      let input = ["n", "h.js", "-n5", "file1"];
      let expectedOutput = { linesToShow: 5, startingIndex: 3 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });

  });

  describe("for input [,, \"-n4\", \"file1\"]", function() {
    it("should return a object containing linesToShow: 4, startingIndex: 3", function() {
      let input = ["n", "h.js", "-n4", "file1"];
      let expectedOutput = { linesToShow: 4, startingIndex: 3 };
      assert.deepEqual(extractCountAndStartingIndex(input), expectedOutput);
    });
  });

  describe("for count 7  provied in 3rd index", function() {
    it("should return a object containing linesToShow: 7, startingIndex: 4", function() {
      let input = ["n", "h.js", "-n", "7", "file1"];
      let expectedOutput = { linesToShow: 7, startingIndex: 4 };
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
    assert.deepEqual(readLinesFromTop(fileContents, dummyReader, 0), []);
  });

  it("should return 10 lines in array for noOfLines:10 ", function() {

    let expectedOutput = [];
    expectedOutput.push("This is line 1");
    expectedOutput.push("This is line 2");
    expectedOutput.push("This is line 3");
    expectedOutput.push("This is line 4");
    expectedOutput.push("This is line 5");
    expectedOutput.push("This is line 6");
    expectedOutput.push("This is line 7");
    expectedOutput.push("This is line 8");
    expectedOutput.push("This is line 9");
    expectedOutput.push("This is line 10");

    assert.deepEqual(readLinesFromTop(fileContents, dummyReader, 10), expectedOutput);
  });

});



describe("head", function() {

  describe("for userInput ['n', 'head.js', 'file1']", function() {
    it("should return first 10 of \"file1\" ", function() {
      let file1 = "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\n";
      let userInput = ["n", "head.js", file1];
      let expectedOutput = "a\nb\nc\nd\ne\nf\ng\nh\ni\nj";
      assert.equal(head(userInput, dummyReader), expectedOutput);
    });
  });

});
