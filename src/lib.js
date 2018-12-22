const { parser } = require("./inputLib.js");

const {
  getIllegalOptionMessage,
  getFileErrorMessage,
  getCountError,
} = require("./error.js");

const {
  generateHeader,
  isOptionValid,
  splitSource,
  isFileInvalid,  
} = require("./util.js");

/* ======= PRIMARY FUNCTION ======= */

const extractFilenames = function(userArgs) {
  const { startingIndex } = parser(userArgs);
  return userArgs.slice(startingIndex);
};

/* ========== READ ========== */

const readFromTop = function (filePath, reader, count, delim) {
  const totalContent = splitSource(filePath, reader, delim);
  return totalContent.slice(0, count).join(delim);
};

const readLinesFromTop = function (filePath, reader, noOfLines) {
  let totalContent = splitSource(filePath, reader, "\n");
  return totalContent.slice(0, noOfLines).join("\n");
};

const readCharFromTop = function (filePath, reader, noOfChar) {
  const totalContent = splitSource(filePath, reader, "");
  return totalContent.slice(0, noOfChar).join("");
};

const readLinesFromBottom = function (filePath, reader, noOfLines) {
  let totalContent = splitSource(filePath, reader, "\n");
  let sliceFrom = Math.max(totalContent.length - noOfLines, 0);
  return totalContent.slice(sliceFrom).join("\n");
};

const readCharFromBottom = function (filePath, reader, noOfChar) {
  let totalContent = splitSource(filePath, reader, "");
  let sliceFrom = Math.max(totalContent.length - noOfChar, 0);
  return totalContent.slice(sliceFrom).join(""); 
};

//put it in a function 
const readingMethods = {
  head: { n: readLinesFromTop, c: readCharFromTop },
  tail: { n: readLinesFromBottom, c: readCharFromBottom }
};

/* =========== ARRANGE ============ */

const getContents = function(userArgs, filePath, reader, operation) {
  const { option, count } = parser(userArgs);
  const chosenMethod = readingMethods[operation][option];
  return chosenMethod(filePath, reader, count);
};

const arrangeContents = function (userArgs, fs, operation) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(userArgs);
  const noOfFiles = fileList.length;

  return fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return getFileErrorMessage(filePath, operation);
    }
    //should return formatWithoutHeader
    if (noOfFiles < 2) {
      return getContents(userArgs, filePath, reader, operation);
    }
    //should return formatWithHeader
    return generateHeader(filePath) + "\n" + 
    getContents(userArgs, filePath, reader, operation);
  }).join("\n");
};

/* ====== CREATE ERROR MESSAGE ====== */

const isCountInvalid = function (count) {
  return count == 0 || !Number.isInteger(+count); //could be a string match
};

const handleErrors = function (userArgs, operation) {
  const { option, count } = parser(userArgs);
  
  if (!isOptionValid(option)) {
    return getIllegalOptionMessage(operation, option);
  }

  if (isOptionValid(option) && isCountInvalid(count)) {
    return getCountError(operation, option, count);
  }

  return false;
};

/* ========= HEAD & TAIL ========= */

const hasError = function(userArgs, operation) {
  return handleErrors(userArgs, operation);
};

const head = function (userArgs, fs) {
  const operation = "head";
  if (hasError(userArgs, operation)) {
    return handleErrors(userArgs, operation);
  }
  return arrangeContents(userArgs, fs, operation);
};

const tail = function (userArgs, fs) {
  const operation = "tail";
  if (hasError(userArgs, operation)) { 
    return handleErrors(userArgs, operation);
  }
  return arrangeContents(userArgs, fs, operation);
};

/* ======== EXPORTS ========= */

module.exports = {
  extractFilenames,
  readFromTop,
  readLinesFromTop,
  readCharFromTop,
  readLinesFromBottom,
  readCharFromBottom,
  getContents,
  arrangeContents,
  handleErrors,
  head,
  tail
};