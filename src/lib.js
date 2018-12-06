/*eslint-env node*/

const { flat } = require("./protoLib.js");

const errorMessage = 'head: illegal option -- ';
const usageMessage = 'usage: head [-n lines | -c bytes] [file ...]';
const invalidLineCount = 'head: illegal line count -- ';
const invalidByteCount = 'head: illegal byte count -- ';


const generateHeader = function(filename) {
  return "==> " + filename + " <==" + "\n"; 
};

const readFile = function(source, reader) {
  let filename = source;
  let contentOfFile = reader(filename, "utf8").split("\n");
  return contentOfFile;
};

const readLinesFromTop = function(filename, reader, noOfLines) {
  let totalContent = readFile(filename, reader);
  return sliceElements(totalContent, noOfLines).join("\n");
};

const exitProcess = function(userInput){
  let option = userInput[2];
  if (option[0] === "-" ) {
    if (option[1] !== "n" && option[1] !== "c" && isNaN(option) ){
      console.error(errorMessage + option[1]);
      console.error(usageMessage);
      process.exit();
    }
  }
};

const extractCountAndStartingIndex = function(userInput) {
  let linesToShow = 0; //default line count
  let charToShow = 0;
  let startingIndex = 0;

  exitProcess(userInput);

  if (userInput[2][0] !== "-") {
    startingIndex = 2;
    linesToShow = 10;
    return { linesToShow, charToShow, startingIndex };
  }

  switch (userInput[2].slice(2).length) {

    case 0: startingIndex = 4;
      if (userInput[2][1] === "n") { linesToShow = userInput[3]; }
      if (userInput[2][1] === "c") { charToShow = userInput[3]; }
      break;

    default: startingIndex = 3; 
      if (userInput[2][1] === "n") { linesToShow = userInput[2].slice(2); }
      if (userInput[2][1] === "c") { charToShow = userInput[2].slice(2); }
      break;
  }

  return { linesToShow, charToShow, startingIndex };
};

const sliceElements = function(content, noOfElements) {
  return content.slice(0, noOfElements);
};



const head = function(userInput, reader) {
  let result = [];
  let { linesToShow, startingIndex } = extractCountAndStartingIndex(userInput);
  let fileCount = userInput.length - startingIndex;

  for (let index = startingIndex; index < userInput.length; index++) {
    if (fileCount > 1 ) { result.push(generateHeader(userInput[index])); }
    result.push(readLinesFromTop(userInput[index], reader, linesToShow));
    result.push("\n\n");
  }

  return result.flat().slice(0, -1).join("");
};



/* ------ EXPORTS ------ */

module.exports = {
  readFile,
  extractCountAndStartingIndex,
  sliceElements,
  readLinesFromTop,
  head
};
