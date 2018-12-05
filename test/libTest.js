/* eslint-env mocha */

const assert = require("assert");

const {
  getLinesToShow,
  trimContent
} = require("../src/lib.js");

describe("getLinesToShow", function(){

  describe("for no count value given", function() {
    it("should return 10", function() {
      let input = ["n", "h.js", "file1"];
      assert.equal(getLinesToShow(input), 10);
    });
  });

  describe("for input [, , \"-n5\", \"file1\"]", function(){
    it("should return 5", function(){
      let input = ["n", "h.js", "-n5", "file1"];
      assert.equal(getLinesToShow(input), 5);
    });
  });

  describe("for input [,, \"-n4\", \"file1\"]" , function() {
    it("should return 4", function() {
      let input = ["n", "h.js", "-n4", "file1"];
      assert.equal(getLinesToShow(input), 4);
    });
  });

  describe("for count 7  provied in 3rd index", function() {
    it("should return 7", function() {
      let input = ["n", "h.js", "-n", "7", "file1"];
      assert.equal(getLinesToShow(input), 7);
    });
  });

});


describe("trimContent", function(){

  describe("for trimUpto 0", function() {
    it("should return blank array", function() {
      let input = [1, 2, 3, "a", "b"];
      assert.deepEqual(trimContent(input, 0), []);
    });
  });

  describe("for trimUpto 10", function() {
    it("should return first 10 elements", function() {
      let input = [1,2,3,4,5,6,7,8,9,10,11,12];
      let expectedOutput = [1,2,3,4,5,6,7,8,9,10];
      assert.deepEqual(trimContent(input, 10), expectedOutput);
    });
  });

});



