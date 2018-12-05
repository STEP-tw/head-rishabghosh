Array.prototype.flat = function() {
  let result = [];
  for(let index = 0; index < this.length; index ++) {
    result = result.concat(this[index]);
  }
  return result;
};

