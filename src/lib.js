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

const handleHeadErrors = function (userInput) {
  const parsedArgs = userInput.slice(2);
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);

  if (!isDefaultChoice(userInput[2])) {//name it better

    if (isOptionInvalid(userInput[2])) {
      return genIllegalOptionMsgForHead(userInput[2][1]);
    }

    if (isOptionLine(userInput[2]) && isCountInvalid(lineCount)) {
      return invalidLineCount + lineCount;
    }

    if (isOptionChar(userInput[2]) && isCountInvalid(charCount)) {
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

const hasHeadError = function(userInput) {
  return handleHeadErrors(userInput);
};

//arrangeContentsOfHead should be the head function
const arrangeContentsOfHead = function (userInput, fs) {
  const parsedArgs = userInput.slice(2);
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

const head = function (userInput, fs) {
  if (hasHeadError(userInput)) {
    return handleHeadErrors(userInput);
  }
  return arrangeContentsOfHead(userInput, fs);
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

const fetchContentsForTail = function(userInput, noOfFiles, filePath, reader) {
  const parsedArgs = userInput.slice(2);
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);
  let result = [];

  if (noOfFiles > 1) { result.push(generateHeader(filePath)); }

  if (isOptionLine(userInput[2])) {
    result.push(readLinesFromBottom(filePath, reader, lineCount));
    result.push("\n");
  }

  if (isOptionChar(userInput[2])) {
    result.push(readCharFromBottom(filePath, reader, charCount));
    result.push("\n");
  }

  return result;
};

const arrangeContentsOfTail = function (userInput, fs) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(userInput.slice(2));
  const noOfFiles = fileList.length;
  let result = [];

  result = fileList.map( function(filePath) {
    if (isFileInvalid(filePath, fs)) {
      return "tail: " + filePath + ": No such file or directory\n";
    }
    return fetchContentsForTail(userInput, noOfFiles, filePath, reader);
  });

  return result.flat().join("");
};

const handleTailErrors = function (userInput) {
  const parsedArgs = userInput.slice(2);
  let illegalCount;
  const { lineCount, charCount } = extractCountAndStartingIndex(parsedArgs);

  if(!Number.isInteger(+lineCount)) { illegalCount = lineCount; }
  if(!Number.isInteger(+charCount)) { illegalCount = charCount; }

  if (userInput[2][0] === "-") {

    if (isOptionInvalid(userInput[2])) {
      return genIllegalOptionMsgForTail(userInput[2][1]);
    }

    if (!isOptionInvalid(userInput[2]) && illegalCount !== undefined) {
      return illegaloffsetMsg + illegalCount;
    } 
  }
  return false;
};

const hasTailErrors = function(userInput) {
  return handleTailErrors(userInput);
};

const tail = function (userInput, fs) {
  if (hasTailErrors(userInput)) {
    return handleTailErrors(userInput);
  }
  return arrangeContentsOfTail(userInput, fs);
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