/* eslint-env mocha */

const assert = require("assert");

const {
  readFile,
  getLineCountRequired,
  sliceElements
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

describe("getLineCountRequired", function() {

  describe("for no count value given", function() {
    it("should return 10", function() {
      let input = ["n", "h.js", "file1"];
      assert.equal(getLineCountRequired(input), 10);
    });
  });

  describe("for input [, , \"-n5\", \"file1\"]", function() {
    it("should return 5", function() {
      let input = ["n", "h.js", "-n5", "file1"];
      assert.equal(getLineCountRequired(input), 5);
    });

  });

  describe("for input [,, \"-n4\", \"file1\"]", function() {
    it("should return 4", function() {
      let input = ["n", "h.js", "-n4", "file1"];
      assert.equal(getLineCountRequired(input), 4);
    });
  });

  describe("for count 7  provied in 3rd index", function() {
    it("should return 7", function() {
      let input = ["n", "h.js", "-n", "7", "file1"];
      assert.equal(getLineCountRequired(input), 7);
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

