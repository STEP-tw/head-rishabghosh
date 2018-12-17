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

/* ===================== */

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

const readingMethods = {
  head: { n: readLinesFromTop, c: readCharFromTop},
  tail: { n: readLinesFromBottom, c: readCharFromBottom}
};

const getContents = function(parsedArgs, filePath, reader, operation) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);
  const noOfFiles = extractFilenames(parsedArgs).length;
  let result = [];
  let option = "n";
  let count = lineCount;
  
  if (isOptionChar(parsedArgs[0])) { 
    count = charCount;
    option = "c";
  }
  //read name can be better
  const read = readingMethods[operation][option];

  if (noOfFiles > 1) { result.push(generateHeader(filePath)); }

  result.push(read(filePath, reader, count));
  return result.join("\n");
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

const hasHeadError = function(parsedArgs) {
  return handleHeadErrors(parsedArgs);
};

const arrangeContentsOfHead = function (parsedArgs, fs) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(parsedArgs);
  let result = [];

  result = fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return genFileErrorMsgForHead(filePath);
    } 
    return getContents(parsedArgs, filePath, reader, "head");
  });

  return result.flat().join("\n");
};

const head = function (parsedArgs, fs) {
  if (hasHeadError(parsedArgs)) {
    return handleHeadErrors(parsedArgs);
  }
  return arrangeContentsOfHead(parsedArgs, fs);
};



const fetchContentsForTail = function(parsedArgs, noOfFiles, filePath, reader) {
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);
  let result = [];

  if (noOfFiles > 1) { result.push(generateHeader(filePath), "\n"); }

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
  let result = [];
  let operation = "tail";

  result = fileList.map( function(filePath) {
    if (isFileInvalid(filePath, fs)) {
      return "tail: " + filePath + ": No such file or directory\n";
    }
    return getContents(parsedArgs, filePath, reader, operation);
  });

  return result.flat().join("\n");
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

const tail = function (parsedArgs, fs) {
  if (hasTailErrors(parsedArgs)) { 
    return handleTailErrors(parsedArgs);
  }
  return arrangeContentsOfTail(parsedArgs, fs);
};

/* ------ EXPORTS ------ */

module.exports = {
  head,
  getContents,
  arrangeContentsOfHead,
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