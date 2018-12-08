/*eslint-env node*/
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const { flat } = require("./protoLib.js");

const errorMessage = "head: illegal option -- ";
const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
const invalidLineCount = "head: illegal line count -- ";
const invalidByteCount = "head: illegal byte count -- ";

const genIllegalOptionMsg = function(option) {
  return errorMessage + option + "\n" + usageMessage;
};

const genInvalidFileError = function(filename) {
  return "head: " + filename + ": No such file or directory\n";
};

const generateHeader = function(filename) {
  return "==> " + filename + " <==" + "\n";
};

const isTypeLine = function(userInput) {
  let firstArg = userInput[2];
  return (firstArg[1] === "n" || firstArg[0] !== "-" ||
    Number.isInteger(+firstArg) || firstArg === "--");
};

const isTypeChar = function(userInput) {
  return (userInput[2][1] === "c");
};

const isTypeInvalid = function(userInput) {
  return !isTypeLine(userInput) && !isTypeChar(userInput);
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

/*
 * each if statement should be its own function
 */
const isDefaultChoice = function(userInput) {
  return userInput[2][0] !== "-";
};

const extractCountAndStartingIndex = function(userInput) {
  let linesToShow = 0;
  let charToShow = 0;
  let startingIndex = 0;

  if (isDefaultChoice(userInput)) {
    startingIndex = 2;
    linesToShow = 10;
    return { linesToShow, charToShow, startingIndex };
  }

  if (userInput[2] === "--") {
    startingIndex = 3;
    linesToShow = 10;
    return { linesToShow, charToShow, startingIndex };
  }
  /*
   * Number.isInteger should be used instead of isNaN
   */
  if (!isNaN(userInput[2])) {
    startingIndex = 3;
    linesToShow = userInput[2].slice(1);
    return { linesToShow, charToShow, startingIndex };
  }
  /*
   * should use better logic to get rid of this switch-case blog
   */
  switch (userInput[2].slice(2).length) { //length of count value if present
    case 0:
      startingIndex = 4;
      if (userInput[2][1] === "n") { linesToShow = userInput[3]; }
      if (userInput[2][1] === "c") { charToShow = userInput[3]; }
      break;
    default:
      startingIndex = 3;
      if (userInput[2][1] === "n") { linesToShow = userInput[2].slice(2); }
      if (userInput[2][1] === "c") { charToShow = userInput[2].slice(2); }
  }

  return { linesToShow, charToShow, startingIndex };
};

const isCountInvalid = function(count) {
  return count < 1 || !Number.isInteger(+count);
};

const ifErrorOccurs = function(userInput) {
  let { linesToShow, charToShow } = extractCountAndStartingIndex(userInput);

  if (userInput[2][0] === "-") {

    if (isTypeInvalid(userInput)) {
      return genIllegalOptionMsg(userInput[2][1]);
    }

    if (isTypeLine(userInput)) {
      if (isCountInvalid(linesToShow)) {
        return invalidLineCount + linesToShow;
      } else {
        return false;
      }
    }

    if (isTypeChar(userInput)) {
      if (isCountInvalid(charToShow)) {
        return invalidByteCount + charToShow;
      } else {
        return false;
      }
    }

  }
  return false;
};

const isFileInvalid = function(filename, fs) {
  return !fs.existsSync(filename);
};
/*
 * should be extracted to smaller function for testing
 */

const getContents = function(userInput, fs) {
  let reader = fs.readFileSync;
  let result = [];
  let { linesToShow, charToShow, startingIndex } = extractCountAndStartingIndex(userInput);
  let fileCount = userInput.length - startingIndex;

  for (let index = startingIndex; index < userInput.length; index++) {
    let filename = userInput[index];

    /*
     * implimented switch case
     */

    if (isFileInvalid(filename, fs)) {
      result.push(genInvalidFileError(filename));
    } else {
      if (fileCount > 1) { result.push(generateHeader(filename)); }

      if (isTypeLine(userInput)) {
        result.push(readLinesFromTop(filename, reader, linesToShow));
        result.push("\n\n");

      }

      if (isTypeChar(userInput)) {
        result.push(readCharFromTop(filename, reader, charToShow));
        result.push("\n");
      }
    }
  }

  return result.flat().join("");
};

const head = function(userInput, fs) {
  if (ifErrorOccurs(userInput)) {
    return ifErrorOccurs(userInput);
  }
  return getContents(userInput, fs);
};

/* ------ EXPORTS ------ */

module.exports = {
  head,
  getContents,
  isFileInvalid,
  isTypeLine,
  isTypeChar,
  splitLine,
  extractCountAndStartingIndex,
  sliceElements,
  readLinesFromTop,
  ifErrorOccurs
};
