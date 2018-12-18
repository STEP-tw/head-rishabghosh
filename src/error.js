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
  return "tail: illegal offset -- " + count;
};

module.exports = {
  getIllegalOptionMsgForHead,
  getIllegalOptionMsgForTail,
  getFileErrorMessage,
  getIllegalCountMessage,
  getIllegalOffsetMessage,
};