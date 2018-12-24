const { parser } = require("./inputLib.js");

const {
  getIllegalOptionMessage,
  getFileErrorMessage,
  getCountError,
} = require("./error.js");

const {
  generateHeader,
  isOptionValid,
  isFileInvalid,  
} = require("./util.js");

/* ======= PRIMARY FUNCTIONS ======= */

const splitSource = function(source, reader, delim) {
  return reader(source, "utf8").split(delim);
};

const extractFilePaths = function(userArgs) {
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
  head: readFromTop,
  tail: readFromBottom,
};

const delimiters = { n: "\n", c: "" };

/* =========== ARRANGE ============ */

const getContents = function(userArgs, filePath, reader, utility) {
  const { option, count } = parser(userArgs);
  const delim = delimiters[option];
  const chosenMethod = readingMethods[utility];
  return chosenMethod(filePath, reader, count, delim);
};

const getFormatWithHeader = function(userArgs, filePath, reader, utility) {
  return generateHeader(filePath) + "\n" + 
  getContents(userArgs, filePath, reader, utility);
};

const arrangeContents = function (userArgs, fs, utility) {
  const reader = fs.readFileSync;
  const fileList = extractFilePaths(userArgs);
  const noOfFiles = fileList.length;

  return fileList.map( function(filePath){
    if (isFileInvalid(filePath, fs)) {
      return getFileErrorMessage(filePath, utility);
    }

    if (noOfFiles < 2) {
      return getContents(userArgs, filePath, reader, utility);
    }
    return getFormatWithHeader(userArgs, filePath, reader, utility);
  }).join("\n");
};

/* ====== CREATE ERROR MESSAGE ====== */

const isCountInvalid = function (count) {
  return count == 0 || !Number.isInteger(+count); //could be a string match
};

const handleErrors = function (userArgs, utility) {
  const { option, count } = parser(userArgs);
  
  if (!isOptionValid(option)) {
    return getIllegalOptionMessage(utility, option);
  }

  if (isOptionValid(option) && isCountInvalid(count)) {
    return getCountError(utility, option, count);
  }

  return false;
};

/* ========= HEAD & TAIL ========= */

const hasError = function(userArgs, utility) {
  return handleErrors(userArgs, utility);
};

const head = function (userArgs, fs) {
  const utility = "head";
  if (hasError(userArgs, utility)) {
    return handleErrors(userArgs, utility);
  }
  return arrangeContents(userArgs, fs, utility);
};

const tail = function (userArgs, fs) {
  const utility = "tail";
  if (hasError(userArgs, utility)) { 
    return handleErrors(userArgs, utility);
  }
  return arrangeContents(userArgs, fs, utility);
};

/* ======== EXPORTS ========= */

module.exports = {
  splitSource,
  extractFilePaths,
  readFromTop,
  readFromBottom,
  getContents,
  arrangeContents,
  handleErrors,
  head,
  tail
};