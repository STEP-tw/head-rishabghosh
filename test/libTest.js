const assert = require('assert');

const {
  getLinesToShow
} = require('../src/lib.js');

describe('getLinesToShow', function(){

  describe('for no count value given', function() {
    it('should return 10', function() {
      let input = ["n", "h.js", "file1"];
      assert.equal(getLinesToShow(input), 10);
    });
  });

  describe('for input [, , "-n5", "file1"]', function(){
    it('should return 5', function(){
      let input = ["n", "h.js", "-n5", "file1"];
      assert.equal(getLinesToShow(input), 5);
    });
  });

  describe('for input [,, "-n4", "file1"]' , function() {
    it('should return 4', function() {
      let input = ["n", "h.js", "-n4", "file1"];
      assert.equal(getLinesToShow(input), 4);
    });
  });

  describe.skip('for count 7  provied in 3rd index', function() {
    it('should return 7', function() {
      let input = ["n", "h.js", "-n", "7", "file1"];
      assert.equal(getLinesToShow(index), 7);
    });
  });

});



