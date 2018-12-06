/*eslint-env node*/

const { flat } = require("./protoLib.js");

const errorMessage = "head: illegal option -- ";
const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
const invalidLineCount = "head: illegal line count -- ";
const invalidByteCount = "head: illegal byte count -- ";


const generateHeader = function(filename) {
  return "==> " + filename + " <==" + "\n"; 
};

const ifLines = function(userInput) {
  return (userInput[2][1] === "n" || userInput[2][0] !== "-" || 
    !isNaN(userInput[2]) || userInput[2] === "--"); 
};
 
const ifBytes = function(userInput) {
  return (userInput[2][1] === "c");
};

const sliceElements = function(content, noOfElements) {
  return content.slice(0, noOfElements);
};

/*
 * splitLine and spltChar dublication can be avoided by using bind
 */

const splitLine = function(source, reader) {
  let filename = source;
  let contentOfFile = reader(filename, "utf8").split("\n");
  return contentOfFile;
};

const splitChar = function(source, reader) {
  let filename = source;
  let contentOfFile = reader(filename, "utf8").split("");
  return contentOfFile;
};

/*
 * dublication can be avoided by binding 
 */

const readLinesFromTop = function(filename, reader, noOfLines) {
  let totalContent = splitLine(filename, reader);
  return sliceElements(totalContent, noOfLines).join("\n");
};

const readCharFromTop = function(filename, reader, noOfChar) {
  let totalContent = splitChar(filename, reader);
  return sliceElements(totalContent, noOfChar).join("");
};

const extractCountAndStartingIndex = function(userInput) {
  let linesToShow = 0;
  let charToShow = 0;
  let startingIndex = 0;

  if (userInput[2][0] !== "-") {
    startingIndex = 2;
    linesToShow = 10;
    return { linesToShow, charToShow, startingIndex };
  }

  if (userInput[2] === "--") { 
    startingIndex = 3; 
    linesToShow = 10;
    return { linesToShow, charToShow, startingIndex };
  }

  if(!isNaN(userInput[2])) { 
    startingIndex = 3;
    linesToShow = userInput[2].slice(1);
    return { linesToShow, charToShow, startingIndex }; 
  }

  switch (userInput[2].slice(2).length) { //length of count value if present
  case 0: startingIndex = 4;
    if (userInput[2][1] === "n") { linesToShow = userInput[3]; }
    if (userInput[2][1] === "c") { charToShow = userInput[3]; }
    break;
  default: startingIndex = 3; 
    if (userInput[2][1] === "n") { linesToShow = userInput[2].slice(2); }
    if (userInput[2][1] === "c") { charToShow = userInput[2].slice(2); }
  }

  return { linesToShow, charToShow, startingIndex };
};

const ifErrorOccurs = function(userInput) {
  let { linesToShow, charToShow } = extractCountAndStartingIndex(userInput);

  if (userInput[2][0] === "-" ) {

    if (!ifLines(userInput) && !ifBytes(userInput)) {
      return errorMessage + userInput[2][1] + "\n" + usageMessage;
    }

    if(ifLines(userInput)) {
      if (linesToShow < 1) {
        return invalidLineCount + linesToShow;
      } else {
        return false; 
      }
    }

    if (ifBytes(userInput)) {
      if (charToShow < 1) {
        return invalidByteCount + charToShow;
      } else {
        return false;
      }
    }

  }
  return false;
};

const head = function(userInput, reader) {
  if (ifErrorOccurs(userInput)) {
    return ifErrorOccurs(userInput);
  }

  let result = [];
  let { linesToShow, charToShow, startingIndex } = extractCountAndStartingIndex(userInput);
  let fileCount = userInput.length - startingIndex;

  for (let index = startingIndex; index < userInput.length; index++) {
    if (fileCount > 1 ) { result.push(generateHeader(userInput[index])); }

    if (ifLines(userInput)) {
      result.push(readLinesFromTop(userInput[index], reader, linesToShow));
      result.push("\n\n");
    }

    if(ifBytes(userInput)) {
      result.push(readCharFromTop(userInput[index], reader, charToShow));
      result.push("\n");
    }
  }

  return result.flat().slice(0, -1).join("");
};

/* ------ EXPORTS ------ */

module.exports = {
  splitLine,
  extractCountAndStartingIndex,
  sliceElements,
  readLinesFromTop,
  head,
  ifErrorOccurs
};
