const errorMsgForHead = "head: illegal option -- ";
const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
const errorMsgForTail = "tail: illegal option -- "; 
const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 



const getIllegalOptionMessage = function(operation, option) {
  const illegalOptionMessages = {
    head: errorMsgForHead + option + "\n" + usageMsgForHead,
    tail: errorMsgForTail + option + "\n" + usageMsgForTail,
  };
  return illegalOptionMessages[operation];
};

const getIllegalCountMessage = function(count, option) {
  const options = { n: "line", c: "byte" };
  return "head: illegal " + options[option] + " count -- " + count;
};

const getIllegalOffsetMessage = function(count) {
  if (count == 0) { return ""; }
  return "tail: illegal offset -- " + count;
};

//temporary name
const getCountError = function(operaton, option, count) {
  const illegalCountMessage = {
    head: getIllegalCountMessage,
    tail: getIllegalOffsetMessage
  };
  const chosenMethod = illegalCountMessage[operaton];
  return chosenMethod(count, option);
};

const getFileErrorMessage = function(filePath, utility) {
  return utility + ": " + filePath + ": No such file or directory\n";
};

module.exports = {
  getIllegalOptionMessage,
  getCountError,
  getFileErrorMessage,
};