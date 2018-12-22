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

/* ======= PRIMARY FUNCTIONS ======= */

const extractFilenames = function(userArgs) {
  const { startingIndex } = parser(userArgs);
  return userArgs.slice(startingIndex);
};


/* ========== READ ========== */

const readFromTop = function (filePath, reader, count, delim) {
  const totalContent = splitSource(filePath, reader, delim);
  return totalContent.slice(0, count).join(delim);
};

const readFromBottom = function (filePath, reader, count, delim) {
  const totalContent = splitSource(filePath, reader, delim);
  const sliceFrom = Math.max(totalContent.length - count, 0);
  return totalContent.slice(sliceFrom).join(delim);
};

//put it in a function 
const readingMethods = {
  head: { n: readFromTop, c: readFromTop },
  tail: { n: readFromBottom, c: readFromBottom }
};

const delimiters = { n: "\n", c: "" };

/* =========== ARRANGE ============ */

const getContents = function(userArgs, filePath, reader, operation) {
  const { option, count } = parser(userArgs);
  const delim = delimiters[option];
  const chosenMethod = readingMethods[operation][option];
  return chosenMethod(filePath, reader, count, delim);
};

const getFormatWithHeader = function(userArgs, filePath, reader, operation) {
  return generateHeader(filePath) + "\n" + 
  getContents(userArgs, filePath, reader, operation);
};

const arrangeContents = function (userArgs, fs, operation) {
  const reader = fs.readFileSync;
  const fileList = extractFilenames(userArgs);
  const noOfFiles = fileList.length;

  return fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return getFileErrorMessage(filePath, operation);
    }

    if (noOfFiles < 2) {
      return getContents(userArgs, filePath, reader, operation);
    }
    return getFormatWithHeader(userArgs, filePath, reader, operation);
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
  readFromBottom,
  getContents,
  arrangeContents,
  handleErrors,
  head,
  tail
};