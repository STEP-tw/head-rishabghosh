/*eslint-env node*/
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const { flat } = require("./protoLib.js");

const errorMsgForHead = "head: illegal option -- ";
const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
const invalidLineCount = "head: illegal line count -- ";
const invalidByteCount = "head: illegal byte count -- ";

const errorMsgForTail = "tail: illegal option -- "; 
const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 
const illegaloffsetMsg = "tail: illegal offset -- "; 

const genIllegalOptionMsgForHead = function (option) {
  return errorMsgForHead + option + "\n" + usageMsgForHead;
};

const genIllegalOptionMsgForTail = function(option) {
  return errorMsgForTail + option + "\n" + usageMsgForTail;
};

const genFileErrorMsgForHead = function (filePath) {
  return "head: " + filePath + ": No such file or directory\n";
};

const generateHeader = function (filePath) {
  return "==> " + filePath + " <==" + "\n";
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

const readLinesFromTop = function (filePath, reader, noOfLines) {
  const totalContent = splitByLine(filePath, reader);
  return totalContent.slice(0, noOfLines).join("\n");
};

const readCharFromTop = function (filePath, reader, noOfChar) {
  const totalContent = splitByChar(filePath, reader);
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
  let lineCount = 0;
  let charCount = 0;
  let startingIndex = 0;

  if (isDefaultChoice(firstArg)) {
    startingIndex = 2;
    lineCount = 10;
    return { lineCount, charCount, startingIndex };
  }

  if (firstArg === "--") {
    startingIndex = 3;
    lineCount = 10;
    return { lineCount, charCount, startingIndex };
  }
   
  if (Number(firstArg)) {
    startingIndex = 3;
    lineCount = Math.abs(firstArg); 
    return { lineCount, charCount, startingIndex };
  }

  /*
   * should use better logic to get rid of this switch-case blog
   */

  switch (firstArg.slice(2).length) { //length of count value if present
    case 0:
      startingIndex = 4;
      if (firstArg[1] === "n") { lineCount = userInput[3]; }
      if (firstArg[1] === "c") { charCount = userInput[3]; }
      break;
    default:
      startingIndex = 3;
      if (firstArg[1] === "n") { lineCount = firstArg.slice(2); }
      if (firstArg[1] === "c") { charCount = firstArg.slice(2); }
  }

  return { lineCount, charCount, startingIndex };
};

const isCountInvalid = function (count) {
  return count < 1 || !Number.isInteger(+count);
};

const handleHeadErrors = function (userInput) {
  const { lineCount, charCount } = extractCountAndStartingIndex(userInput);

  if (userInput[2][0] === "-") {

    if (isOptionInvalid(userInput)) {
      return genIllegalOptionMsgForHead(userInput[2][1]);
    }

    if (isOptionLine(userInput)) {
      if (isCountInvalid(lineCount)) {
        return invalidLineCount + lineCount;
      } else {
        return false;
      }
    }

    if (isOptionChar(userInput)) {
      if (isCountInvalid(charCount)) {
        return invalidByteCount + charCount;
      } else {
        return false;
      }
    }

  }
  return false;
};

const extractFilenames = function(userInput) {
  const { startingIndex } = extractCountAndStartingIndex(userInput);
  let result = [];
  for (let index = startingIndex; index < userInput.length; index++) {
    let filePath = userInput[index];
    result.push(filePath);
  }
  return result;
};

const isFileInvalid = function (filePath, fs) {
  return !fs.existsSync(filePath);
};

//change name - starting index 
const fetchContentsForHead = function(userInput, noOfFiles, filePath, reader) {
  const { lineCount, charCount } = extractCountAndStartingIndex(userInput);
  let result = [];
  if (noOfFiles > 1) { result.push(generateHeader(filePath)); }

  if (isOptionLine(userInput)) {
    result.push(readLinesFromTop(filePath, reader, lineCount));
    result.push("\n\n");
  }

  if (isOptionChar(userInput)) {
    result.push(readCharFromTop(filePath, reader, charCount));
    result.push("\n");
  }
  return result;
};

const hasHeadError = function(userInput) {
  return handleHeadErrors(userInput);
};

//getContentsOfHead should be the head function
const getContentsOfHead = function (userInput, fs) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(userInput);
  const noOfFiles = fileList.length;
  let result = [];

  result = fileList.map( function(filePath){

    if (isFileInvalid(filePath, fs)) {
      return genFileErrorMsgForHead(filePath);
    } 
    return fetchContentsForHead(userInput, noOfFiles, filePath, reader);
  });

  return result.flat().join("");
};

const head = function (userInput, fs) {
  if (hasHeadError(userInput)) {
    return handleHeadErrors(userInput);
  }
  return getContentsOfHead(userInput, fs);
};

const readLinesFromBottom = function (filePath, reader, noOfLines) {
  const totalContent = splitByLine(filePath, reader);
  let sliceFrom = totalContent.length - noOfLines;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join("\n");
};

const readCharFromBottom = function (filePath, reader, noOfChar) {
  const totalContent = splitByChar(filePath, reader);
  let sliceFrom = totalContent.length - noOfChar;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join(""); 
};

const getContentsOfTail = function (userInput, fs) {
  const { lineCount, charCount } = extractCountAndStartingIndex(userInput);
  const reader = fs.readFileSync;
  const fileList = extractFilenames(userInput);
  let result = [];

  fileList.map( function(filePath) {

    if (isFileInvalid(filePath, fs)) {
      result.push("tail: " + filePath + ": No such file or directory\n");
    } else {

      if (fileList.length > 1) {
        result.push(generateHeader(filePath));
      }

      if (isOptionLine(userInput)) {
        result.push(readLinesFromBottom(filePath, reader, lineCount));
        result.push("\n");
      }

      if (isOptionChar(userInput)) {
        result.push(readCharFromBottom(filePath, reader, charCount));
        result.push("\n");
      }

    }
  });

  return result.flat().join("");
};

const handleTailErrors = function (userInput) {
  let illegalCount;
  const { lineCount, charCount } = extractCountAndStartingIndex(userInput);

  if(!Number.isInteger(+lineCount)) { illegalCount = lineCount; }
  if(!Number.isInteger(+charCount)) { illegalCount = charCount; }

  if (userInput[2][0] === "-") {

    if (isOptionInvalid(userInput)) {
      return genIllegalOptionMsgForTail(userInput[2][1]);
    }

    if (!isOptionInvalid(userInput) && illegalCount !== undefined) {
      return illegaloffsetMsg + illegalCount;
    } 
  }
  return false;
};

const tail = function (userInput, fs) {
  if (handleTailErrors(userInput)) {
    return handleTailErrors(userInput);
  }
  return getContentsOfTail(userInput, fs);
};

/* ------ EXPORTS ------ */

module.exports = {
  head,
  getContentsOfHead,
  fetchContentsForHead,
  isFileInvalid,
  isOptionLine,
  isOptionChar,
  splitByLine,
  splitByChar,
  extractCountAndStartingIndex,
  readLinesFromTop,
  readCharFromTop,
  handleHeadErrors,
  readLinesFromBottom,
  readCharFromBottom,
  extractFilenames,
  getContentsOfTail,
  tail
};
