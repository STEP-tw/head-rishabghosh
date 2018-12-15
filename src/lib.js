/*eslint-env node*/
/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const { flat } = require("./protoLib.js");
const {
  genIllegalOptionMsgForHead,
  genIllegalOptionMsgForTail,
  genFileErrorMsgForHead,
  invalidLineCount,
  invalidByteCount,
  illegaloffsetMsg,
} = require("./error.js");

const {
  generateHeader,
  isOptionLine,
  isOptionChar,
  isOptionInvalid,
  splitByLine,
  splitByChar,
  isFileInvalid,  
} = require("./util.js");

/* ======= PRIMARY FUNCTIONS ======= */

const isDefaultChoice = function (firstArg) {
  return firstArg[0] !== "-";
};

const extractCountAndStartingIndex = function (parsedArgs) {
  let firstArg = parsedArgs[0];
  let lineCount = 0;
  let charCount = 0;
  let startingIndex = 0;

  if (isDefaultChoice(firstArg)) {
    startingIndex = 0;
    lineCount = 10;
    return { lineCount, charCount, startingIndex };
  }

  if (firstArg === "--") {
    startingIndex = 1;
    lineCount = 10;
    return { lineCount, charCount, startingIndex };
  }
   
  if (!isNaN(firstArg)) {
    startingIndex = 1;
    lineCount = Math.abs(firstArg); 
    return { lineCount, charCount, startingIndex };
  }

  /*
   * should use better logic to get rid of this switch-case
   */

  switch (firstArg.slice(2).length) { //length of count value if present
    case 0:
      startingIndex = 2;
      if (firstArg[1] === "n") { lineCount = parsedArgs[1]; }
      if (firstArg[1] === "c") { charCount = parsedArgs[1]; }
      break;
    default:
      startingIndex = 1;
      if (firstArg[1] === "n") { lineCount = firstArg.slice(2); }
      if (firstArg[1] === "c") { charCount = firstArg.slice(2); }
  }

  return { lineCount, charCount, startingIndex };
};

const extractFilenames = function(parsedArgs) {
  const { startingIndex } = extractCountAndStartingIndex(parsedArgs);
  let result = [];
  for (let index = startingIndex; index < parsedArgs.length; index++) {
    let filePath = parsedArgs[index];
    result.push(filePath);
  }
  return result;
};

/* ========== HEAD =========== */

const readLinesFromTop = function (filePath, reader, noOfLines) {
  const totalContent = splitByLine(filePath, reader);
  return totalContent.slice(0, noOfLines).join("\n");
};

const readCharFromTop = function (filePath, reader, noOfChar) {
  const totalContent = splitByChar(filePath, reader);
  return totalContent.slice(0, noOfChar).join("");
};

const isCountInvalid = function (count) {
  return count < 1 || !Number.isInteger(+count);
};

const handleHeadErrors = function (parsedArgs) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);

  if (!isDefaultChoice(parsedArgs[0])) {//name it better

    if (isOptionInvalid(parsedArgs[0])) {
      return genIllegalOptionMsgForHead(parsedArgs[0][1]);
    }

    if (isOptionLine(parsedArgs[0]) && isCountInvalid(lineCount)) {
      return invalidLineCount + lineCount;
    }

    if (isOptionChar(parsedArgs[0]) && isCountInvalid(charCount)) {
      return invalidByteCount + charCount;
    }

  }
  return false;
};

//change name - starting index 
const fetchContentsForHead = function(parsedArgs, noOfFiles, filePath, reader) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);
  let result = [];
  if (noOfFiles > 1) { result.push(generateHeader(filePath)); }

  if (isOptionLine(parsedArgs[0])) {
    result.push(readLinesFromTop(filePath, reader, lineCount));
    result.push("\n\n");
  }

  if (isOptionChar(parsedArgs[0])) {
    result.push(readCharFromTop(filePath, reader, charCount));
    result.push("\n");
  }
  return result;
};

const hasHeadError = function(parsedArgs) {
  return handleHeadErrors(parsedArgs);
};

//arrangeContentsOfHead should be the head function
const arrangeContentsOfHead = function (parsedArgs, fs) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(parsedArgs);
  const noOfFiles = fileList.length;
  
  let result = [];

  result = fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return genFileErrorMsgForHead(filePath);
    } 
    return fetchContentsForHead(parsedArgs, noOfFiles, filePath, reader);
  });

  return result.flat().join("");
};

const head = function (parsedArgs, fs) {
  if (hasHeadError(parsedArgs)) {
    return handleHeadErrors(parsedArgs);
  }
  return arrangeContentsOfHead(parsedArgs, fs);
};

/* ========= TAIL ========= */

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

const fetchContentsForTail = function(parsedArgs, noOfFiles, filePath, reader) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);
  let result = [];

  if (noOfFiles > 1) { result.push(generateHeader(filePath)); }

  if (isOptionLine(parsedArgs[0])) {
    result.push(readLinesFromBottom(filePath, reader, lineCount));
    result.push("\n");
  }

  if (isOptionChar(parsedArgs[0])) {
    result.push(readCharFromBottom(filePath, reader, charCount));
    result.push("\n");
  }

  return result;
};

const arrangeContentsOfTail = function (parsedArgs, fs) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(parsedArgs);
  const noOfFiles = fileList.length;
  let result = [];

  result = fileList.map( function(filePath) {
    if (isFileInvalid(filePath, fs)) {
      return "tail: " + filePath + ": No such file or directory\n";
    }
    return fetchContentsForTail(parsedArgs, noOfFiles, filePath, reader);
  });

  return result.flat().join("");
};

const handleTailErrors = function (parsedArgs) {
  let illegalCount;
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);

  if(!Number.isInteger(+lineCount)) { illegalCount = lineCount; }
  if(!Number.isInteger(+charCount)) { illegalCount = charCount; }

  if (parsedArgs[0][0] === "-") {

    if (isOptionInvalid(parsedArgs[0])) {
      return genIllegalOptionMsgForTail(parsedArgs[0][1]);
    }

    if (!isOptionInvalid(parsedArgs[0]) && illegalCount !== undefined) {
      return illegaloffsetMsg + illegalCount;
    } 
  }
  return false;
};

const hasTailErrors = function(parsedArgs) {
  return handleTailErrors(parsedArgs);
};

const tail = function (userInput, fs) {
  const parsedArgs = userInput.slice(2);
  if (hasTailErrors(parsedArgs)) { 
    return handleTailErrors(parsedArgs);
  }
  return arrangeContentsOfTail(parsedArgs, fs);
};

/* ------ EXPORTS ------ */

module.exports = {
  head,
  arrangeContentsOfHead,
  fetchContentsForHead,
  extractCountAndStartingIndex,
  readLinesFromTop,
  readCharFromTop,
  handleHeadErrors,
  readLinesFromBottom,
  readCharFromBottom,
  extractFilenames,
  arrangeContentsOfTail,
  handleTailErrors,
  tail
};