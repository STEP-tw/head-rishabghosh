const errorMsgForHead = "head: illegal option -- ";
const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
const errorMsgForTail = "tail: illegal option -- "; 
const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 

const getIllegalOptionMsgForHead = function (option) {
  return errorMsgForHead + option + "\n" + usageMsgForHead;
};

const getIllegalOptionMsgForTail = function(option) {
  return errorMsgForTail + option + "\n" + usageMsgForTail;
};

const getFileErrorMessage = function(filePath, utility) {
  return utility + ": " + filePath + ": No such file or directory\n";
};

//put it in a function or closure
const illegalMessages = { n: "line", c: "byte" };

const getIllegalCountMessage = function(count, option) {
  return "head: illegal " + illegalMessages[option] + " count -- " + count;
};

const getIllegalOffsetMessage = function(count) {
  if (count == 0) { return ""; }
  return "tail: illegal offset -- " + count;
};

const illegalOptionMessages = {
  head: getIllegalOptionMsgForHead,
  tail: getIllegalOptionMsgForTail
};

const getIllegalOptionMessage = function(operation, option) {
  const chosenMethod = illegalOptionMessages[operation];
  return chosenMethod(option);
};

module.exports = {
  getIllegalOptionMsgForHead,
  getIllegalOptionMsgForTail,
  getFileErrorMessage,
  getIllegalCountMessage,
  getIllegalOffsetMessage,
  getIllegalOptionMessage
};