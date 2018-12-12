/*eslint-env node*/
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const {
  flat
} = require("./protoLib.js");

const errorMsgForHead = "head: illegal option -- ";
const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
const invalidLineCount = "head: illegal line count -- ";
const invalidByteCount = "head: illegal byte count -- ";

const errorMsgForTail = "tail: illegal option -- "; 
const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 

const genIllegalOptionMsgForHead = function (option) {
  return errorMsgForHead + option + "\n" + usageMsgForHead;
};

const genIllegalOptionMsgForTail = function(option) {
  return errorMsgForTail + option + "\n" + usageMsgForTail;
};

const genFileErrorMsgForHead = function (filename) {
  return "head: " + filename + ": No such file or directory\n";
};

const generateHeader = function (filename) {
  return "==> " + filename + " <==" + "\n";
};

const isOptionLine = function (userInput) {
  let firstArg = userInput[2];
  return (firstArg[1] === "n" || firstArg[0] !== "-" ||
    Number.isInteger(+firstArg) || firstArg === "--");
};

const isOptionChar = function (userInput) {
  return (userInput[2][1] === "c");
};

const isOptionInvalid = function (userInput) {
  return !isOptionLine(userInput) && !isOptionChar(userInput);
};

const splitSource = function (source, reader) {
  return reader(source, "utf8").split(this);
};

const splitByLine = splitSource.bind("\n");
const splitByChar = splitSource.bind("");

const readLinesFromTop = function (filename, reader, noOfLines) {
  let totalContent = splitByLine(filename, reader);
  return totalContent.slice(0, noOfLines).join("\n");
};

const readCharFromTop = function (filename, reader, noOfChar) {
  let totalContent = splitByChar(filename, reader);
  return totalContent.slice(0, noOfChar).join("");
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

  if (isDefaultChoice(firstArg)) {
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

    if (isOptionInvalid(userInput)) {
      return genIllegalOptionMsgForHead(userInput[2][1]);
    }

    if (isOptionLine(userInput)) {
      if (isCountInvalid(linesToShow)) {
        return invalidLineCount + linesToShow;
      } else {
        return false;
      }
    }

    if (isOptionChar(userInput)) {
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
      result.push(genFileErrorMsgForHead(filename));
    } else {
      if (fileCount > 1) {
        result.push(generateHeader(filename));
      }

      if (isOptionLine(userInput)) {
        result.push(readLinesFromTop(filename, reader, linesToShow));
        result.push("\n\n");

      }

      if (isOptionChar(userInput)) {
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
  let sliceFrom = totalContent.length - noOfLines;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join("\n");
};

const readCharFromBottom = function (filename, reader, noOfChar) {
  let totalContent = splitByChar(filename, reader);
  let sliceFrom = totalContent.length - noOfChar;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join(""); 
};

const getContentsOfTail = function (userInput, fs) {
  const reader = fs.readFileSync;
  let result = [];
  const {
    linesToShow,
    charToShow,
    startingIndex
  } = extractCountAndStartingIndex(userInput);
  const fileCount = userInput.length - startingIndex;

  for (let index = startingIndex; index < userInput.length; index++) {
    let filename = userInput[index];

    /*
     * try to impliment switch case 
     */

    if (isFileInvalid(filename, fs)) {
      result.push("tail: " + filename + ": No such file or directory\n");
    } else {

      if (fileCount > 1) {
        result.push(generateHeader(filename));
      }

      if (isOptionLine(userInput)) {
        result.push(readLinesFromBottom(filename, reader, linesToShow));
        result.push("\n");
      }

      if (isOptionChar(userInput)) {
        result.push(readCharFromBottom(filename, reader, charToShow));
        result.push("\n");
      }

    }
  }

  return result.flat().join("");
};

const ifTailErrorOccurs = function (userInput) {
  let illegalCount;
  const { linesToShow, charToShow } = extractCountAndStartingIndex(userInput);

  if(!Number.isInteger(+linesToShow)) { illegalCount = linesToShow; }
  if(!Number.isInteger(+charToShow)) { illegalCount = charToShow; }

  if (userInput[2][0] === "-") {

    if (isOptionInvalid(userInput)) {
      return genIllegalOptionMsgForTail(userInput[2][1]);
    }

    if (!isOptionInvalid(userInput) && illegalCount !== undefined) {
      return "tail: illegal offset -- " + illegalCount;
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
  isOptionLine,
  isOptionChar,
  splitByLine,
  splitByChar,
  extractCountAndStartingIndex,
  readLinesFromTop,
  readCharFromTop,
  ifErrorOccurs,
  readLinesFromBottom,
  readCharFromBottom,
  getContentsOfTail,
  tail
};
