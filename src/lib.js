/*eslint-env node*/
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const {
  flat
} = require("./protoLib.js");

const errorMessage = "head: illegal option -- ";
const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
const invalidLineCount = "head: illegal line count -- ";
const invalidByteCount = "head: illegal byte count -- ";

const genIllegalOptionMsg = function (option) {
  return errorMessage + option + "\n" + usageMessage;
};

const genInvalidFileError = function (filename) {
  return "head: " + filename + ": No such file or directory\n";
};

const generateHeader = function (filename) {
  return "==> " + filename + " <==" + "\n";
};

const isTypeLine = function (userInput) {
  let firstArg = userInput[2];
  return (firstArg[1] === "n" || firstArg[0] !== "-" ||
    Number.isInteger(+firstArg) || firstArg === "--");
};

const isTypeChar = function (userInput) {
  return (userInput[2][1] === "c");
};

const isTypeInvalid = function (userInput) {
  return !isTypeLine(userInput) && !isTypeChar(userInput);
};

const sliceElements = function (content, noOfElements) {
  return content.slice(0, noOfElements);
};

const splitSource = function (source, reader) {
  return reader(source, "utf8").split(this);
};

const splitByLine = splitSource.bind("\n");
const splitByChar = splitSource.bind("");

const readLinesFromTop = function (filename, reader, noOfLines) {
  let totalContent = splitByLine(filename, reader);
  return sliceElements(totalContent, noOfLines).join("\n");
};

const readCharFromTop = function (filename, reader, noOfChar) {
  let totalContent = splitByChar(filename, reader);
  return sliceElements(totalContent, noOfChar).join("");
};

/*
 * each if statement should be its own function
 */

const isDefaultChoice = function (firstArg) {
  return firstArg[0] !== "-";
};

const extractCountAndStartingIndex = function (userInput) {
  let firstArg = userInput[2];
  let linesToShow = 0;
  let charToShow = 0;
  let startingIndex = 0;

  if (firstArg[0] !== "-") {
    startingIndex = 2;
    linesToShow = 10;
    return {
      linesToShow,
      charToShow,
      startingIndex
    };
  }

  if (firstArg === "--") {
    startingIndex = 3;
    linesToShow = 10;
    return {
      linesToShow,
      charToShow,
      startingIndex
    };
  }
   
  if (Number(firstArg)) {
    startingIndex = 3;
    linesToShow = firstArg.slice(1);
    return {
      linesToShow,
      charToShow,
      startingIndex
    };
  }
  /*
   * should use better logic to get rid of this switch-case blog
   */
  switch (firstArg.slice(2).length) { //length of count value if present
    case 0:
      startingIndex = 4;
      if (firstArg[1] === "n") {
        linesToShow = userInput[3];
      }
      if (firstArg[1] === "c") {
        charToShow = userInput[3];
      }
      break;
    default:
      startingIndex = 3;
      if (firstArg[1] === "n") {
        linesToShow = firstArg.slice(2);
      }
      if (firstArg[1] === "c") {
        charToShow = firstArg.slice(2);
      }
  }

  return {
    linesToShow,
    charToShow,
    startingIndex
  };
};

const isCountInvalid = function (count) {
  return count < 1 || !Number.isInteger(+count);
};

const ifErrorOccurs = function (userInput) {
  let {
    linesToShow,
    charToShow
  } = extractCountAndStartingIndex(userInput);

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

const isFileInvalid = function (filename, fs) {
  return !fs.existsSync(filename);
};

/*
 * should be extracted to smaller function for testing
 */

const getContentsOfHead = function (userInput, fs) {
  let reader = fs.readFileSync;
  let result = [];
  let {
    linesToShow,
    charToShow,
    startingIndex
  } = extractCountAndStartingIndex(userInput);
  let fileCount = userInput.length - startingIndex;

  for (let index = startingIndex; index < userInput.length; index++) {
    let filename = userInput[index];

    /*
     * try to impliment switch case 
     */

    if (isFileInvalid(filename, fs)) {
      result.push(genInvalidFileError(filename));
    } else {
      if (fileCount > 1) {
        result.push(generateHeader(filename));
      }

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

const head = function (userInput, fs) {
  if (ifErrorOccurs(userInput)) {
    return ifErrorOccurs(userInput);
  }
  return getContentsOfHead(userInput, fs);
};

const readLinesFromBottom = function (filename, reader, noOfLines) {
  let totalContent = splitByLine(filename, reader);
  return totalContent.slice(totalContent.length - noOfLines).join("\n");
};

const readCharFromBottom = function (filename, reader, noOfChar) {
  let totalContent = splitByChar(filename, reader);
  return totalContent.slice(totalContent.length - noOfChar).join(""); 
};

const getContentsOfTail = function (userInput, fs) {
  let reader = fs.readFileSync;
  let result = [];
  let {
    linesToShow,
    charToShow,
    startingIndex
  } = extractCountAndStartingIndex(userInput);
  let fileCount = userInput.length - startingIndex;

  for (let index = startingIndex; index < userInput.length; index++) {
    let filename = userInput[index];

    /*
     * try to impliment switch case 
     */

    if (isFileInvalid(filename, fs)) {
      result.push("tail: " + filename + ": No such file or directory");
    } else {

      if (fileCount > 1) {
        result.push(generateHeader(filename));
      }

      if (isTypeLine(userInput)) {
        result.push(readLinesFromBottom(filename, reader, linesToShow));
      }

      if (isTypeChar(userInput)) {
        result.push(readCharFromBottom(filename, reader, charToShow));
      }

    }
  }

  return result.flat().join("");
};

const ifTailErrorOccurs = function (userInput) {
  let {
    linesToShow,
    charToShow
  } = extractCountAndStartingIndex(userInput);

  if (userInput[2][0] === "-") {

    if (isTypeInvalid(userInput)) {
      return "tail: illegal option -- " +userInput[2][1]+"\n" +"usage: tail [-n lines | -c bytes] [file ...]"; 
    }

    if (isTypeLine(userInput)) {
      if (isCountInvalid(linesToShow)) {
        return "tail: illegal line count -- " + linesToShow;
      } else {
        return false;
      }
    }

    if (isTypeChar(userInput)) {
      if (isCountInvalid(charToShow)) {
        return "tail: illegal byte count -- " + charToShow;
      } else {
        return false;
      }
    }

  }
  return false;
};

const tail = function (userInput, fs) {
  if (ifTailErrorOccurs(userInput)) {
    return ifTailErrorOccurs(userInput);
  }
  return getContentsOfTail(userInput, fs);
};

/* ------ EXPORTS ------ */

module.exports = {
  head,
  getContentsOfHead,
  isFileInvalid,
  isTypeLine,
  isTypeChar,
  splitByLine,
  splitByChar,
  extractCountAndStartingIndex,
  sliceElements,
  readLinesFromTop,
  readCharFromTop,
  ifErrorOccurs,
  readLinesFromBottom,
  readCharFromBottom,
  getContentsOfTail,
  tail
};
