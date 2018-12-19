const errorMsgForHead = "head: illegal option -- ";
const usageMsgForHead = "usage: head [-n lines | -c bytes] [file ...]";
const errorMsgForTail = "tail: illegal option -- "; 
const usageMsgForTail = "usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]"; 

const illegalOptionMessages = {
  head: (option)=> errorMsgForHead + option + "\n" + usageMsgForHead,
  tail: (option)=> errorMsgForTail + option + "\n" + usageMsgForTail,
};

const getIllegalOptionMessage = function(operation, option) {
  const chosenMethod = illegalOptionMessages[operation];
  return chosenMethod(option);
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

const illegalCountMessage = {
  head: getIllegalCountMessage,
  tail: getIllegalOffsetMessage
};
//temporary name
const getIllegalCountOffsetMessage = function(operaton, option, count) {
  const chosenMethod = illegalCountMessage[operaton];
  return chosenMethod(count, option);
};

const getFileErrorMessage = function(filePath, utility) {
  return utility + ": " + filePath + ": No such file or directory\n";
};


module.exports = {
  getIllegalOptionMessage,
  getIllegalCountMessage,
  getIllegalOffsetMessage,
  getFileErrorMessage,
  getIllegalCountOffsetMessage
};