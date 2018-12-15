const errorMsgForHead = "head: illegal option -- ";
const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
const invalidLineCount = "head: illegal line count -- ";
const invalidByteCount = "head: illegal byte count -- ";
const illegaloffsetMsg = "tail: illegal offset -- "; 

const errorMsgForTail = "tail: illegal option -- "; 
const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 

const genIllegalOptionMsgForHead = function (option) {
  return errorMsgForHead + option + "\n" + usageMsgForHead;
};

const genIllegalOptionMsgForTail = function(option) {
  return errorMsgForTail + option + "\n" + usageMsgForTail;
};

const genFileErrorMsgForHead = function (filePath) {
  return "head: " + filePath + ": No such file or directory\n";
};


module.exports = {
  genIllegalOptionMsgForHead,
  genIllegalOptionMsgForTail,
  genFileErrorMsgForHead,
  invalidLineCount,
  invalidByteCount,
  illegaloffsetMsg,
};