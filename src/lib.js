/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/

const {
  getIllegalOptionMsgForHead,
  getIllegalOptionMsgForTail,
  getIllegalCountMessage,
  getFileErrorMessage,
  getIllegalOffsetMessage,
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

  if (isDefaultChoice(firstArg)) {//can use !startsWith
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
    lineCount = firstArg.slice(1); 
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

/* ========== READ ========== */

const readLinesFromTop = function (filePath, reader, noOfLines) {
  let totalContent = splitByLine(filePath, reader);
  totalContent.push("\n\n");
  return totalContent.slice(0, noOfLines).join("\n");
};

const readCharFromTop = function (filePath, reader, noOfChar) {
  const totalContent = splitByChar(filePath, reader);
  return totalContent.slice(0, noOfChar).join("");
};

const readLinesFromBottom = function (filePath, reader, noOfLines) {
  let totalContent = splitByLine(filePath, reader);
  let sliceFrom = totalContent.length - noOfLines;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join("\n");
};

const readCharFromBottom = function (filePath, reader, noOfChar) {
  let totalContent = splitByChar(filePath, reader);
  let sliceFrom = totalContent.length - noOfChar;
  if (sliceFrom < 0) { sliceFrom = 0; }
  return totalContent.slice(sliceFrom).join(""); 
};

//put it in a function 
const readingMethods = {
  head: { n: readLinesFromTop, c: readCharFromTop },
  tail: { n: readLinesFromBottom, c: readCharFromBottom }
};

/* =========== ARRANGE ============ */

const getContents = function(parsedArgs, filePath, reader, operation) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);
  let option = "n";
  let count = lineCount;
  
  if (isOptionChar(parsedArgs[0])) { 
    count = charCount;
    option = "c";
  }

  const chosenMethod = readingMethods[operation][option];
  return chosenMethod(filePath, reader, count);
};

//use operation as a arg
const arrangeContents = function (parsedArgs, fs, operation) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(parsedArgs);
  const noOfFiles = fileList.length;

  return fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return getFileErrorMessage(filePath, operation);
    }
    if (noOfFiles === 1) {
      return getContents(parsedArgs, filePath, reader, operation);
    }
    return generateHeader(filePath) + "\n" + 
    getContents(parsedArgs, filePath, reader, operation);
  }).join("\n");
};

//const arrangeContentsOfHead = arrangeContents.bind("head");
//const arrangeContentsOfTail = arrangeContents.bind("tail");

/* ====== CREATE ERROR MESSAGE ====== */

const isCountInvalid = function (count) {
  return count < 1 || !Number.isInteger(+count);
};

const handleHeadErrors = function (parsedArgs) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);

  if (!isDefaultChoice(parsedArgs[0])) {//name it better

    if (isOptionInvalid(parsedArgs[0])) {
      return getIllegalOptionMsgForHead(parsedArgs[0][1]);
    }

    if (isOptionLine(parsedArgs[0]) && isCountInvalid(lineCount)) {
      return getIllegalCountMessage(lineCount, "line");
    }

    if (isOptionChar(parsedArgs[0]) && isCountInvalid(charCount)) {
      return getIllegalCountMessage(charCount, "byte");
    }

  }
  return false;
};

const handleTailErrors = function (parsedArgs) {
  let illegalCount;
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);

  if(!Number.isInteger(+lineCount)) { illegalCount = lineCount; }
  if(!Number.isInteger(+charCount)) { illegalCount = charCount; }

  if (parsedArgs[0][0] === "-") {

    if (isOptionInvalid(parsedArgs[0])) {
      return getIllegalOptionMsgForTail(parsedArgs[0][1]);
    }

    if (!isOptionInvalid(parsedArgs[0]) && illegalCount !== undefined) {
      return getIllegalOffsetMessage(illegalCount);
    } 
  }
  return false;
};

/* ========= HEAD & TAIL ========= */

const hasHeadError = function(parsedArgs) {
  return handleHeadErrors(parsedArgs);
};

const head = function (parsedArgs, fs) {
  if (hasHeadError(parsedArgs)) {
    return handleHeadErrors(parsedArgs);
  }
  return arrangeContents(parsedArgs, fs, "head");
  //  return arrangeContentsOfHead(parsedArgs, fs);
};

const hasTailErrors = function(parsedArgs) {
  return handleTailErrors(parsedArgs);
};

const tail = function (parsedArgs, fs) {
  if (hasTailErrors(parsedArgs)) { 
    return handleTailErrors(parsedArgs);
  }
  return arrangeContents(parsedArgs, fs, "tail");
  //return arrangeContentsOfTail(parsedArgs, fs);
};

/* ======== EXPORTS ========= */

module.exports = {
  head,
  getContents,
  arrangeContents,
 // arrangeContentsOfHead,
  extractCountAndStartingIndex,
  readLinesFromTop,
  readCharFromTop,
  handleHeadErrors,
  readLinesFromBottom,
  readCharFromBottom,
  extractFilenames,
 // arrangeContentsOfTail,
  handleTailErrors,
  tail
};