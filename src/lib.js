/*eslint-env node*/

const { flat } = require("./protoLib.js");

const generateHeader = function(filename) {
  return "==> " + filename + " <==" + "\n"; 
};

const readFile = function(source, reader) {
  let filename = source;
  let contentOfFile = reader(filename, "utf8").split("\n");
  return contentOfFile;
};

const extractCountAndStartingIndex = function(userInput) {
  let linesToShow = 10; //default line count
  let startingIndex = 0;

  if (userInput[2][0] !== "-") {
    startingIndex = 2;
    return { linesToShow, startingIndex };
  }

  switch (userInput[2].length) {
  case 2:
    if (userInput[2][1] === "n") { linesToShow = userInput[3];
      startingIndex = 4; }
    break;
  case 3:
    if (userInput[2][1] === "n") { linesToShow = userInput[2].slice(2);
      startingIndex = 3; }
    break;
  }

  return { linesToShow, startingIndex };
};

const sliceElements = function(content, noOfElements) {
  return content.slice(0, noOfElements);
};

const readLinesFromTop = function(filename, reader, noOfLines) {
  let totalContent = readFile(filename, reader);
  return sliceElements(totalContent, noOfLines).join("\n");
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
