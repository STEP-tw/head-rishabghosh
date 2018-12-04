const {
  readFile
} = require('./util.js');

const getLinesToShow = function(processArgv) {
  let linesToshow = 10;
  
  //need to use switch case insted of if's
  if(processArgv[2][0] === "-"){
    if(processArgv[2][1] === "n"){

      if(processArgv[2].length === 3 ){
        linesToshow = processArgv[2][2];
      }

      if(processArgv[2].length === 2) {
        linesToshow = processArgv[3];
      }
    } else {
      linesToshow = processArgv[2][1];
    }
  }

  return linesToshow; 
};



module.exports = {
  getLinesToShow
}





