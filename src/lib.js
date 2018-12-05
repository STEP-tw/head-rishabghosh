/*eslint-env node*/

const readFile = function(source, reader) {
  let filename = source;
  let contentOfFile = reader(filename, "utf8").split("\n");
  return contentOfFile;
};

const getLineCountRequired = function(userInput) {
  let linesToShow = 10;       //default line count

  //need to use switch case insted of if's
  if (userInput[2][0] === "-") {
    if (userInput[2][1] === "n") {

      if (userInput[2].length === 3) {
        linesToShow = userInput[2][2];
      }

      if (userInput[2].length === 2) {
        linesToShow = userInput[3];
      }
    } else {
      linesToShow = userInput[2][1];
    }
  }

  return linesToShow;
};

const sliceElements = function(content, noOfElements) {
  return content.slice(0, noOfElements);
};

const headFile = function(filename, reader) {
  let totalContent = readFile(filename, reader);
  return sliceElements(totalContent, 10).join("\n");
};

/* ------ EXPORTS ------ */

module.exports = {
  readFile,
  getLineCountRequired,
  sliceElements,
  headFile
};
