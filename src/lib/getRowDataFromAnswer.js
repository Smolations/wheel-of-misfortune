
// @param {string} line something like 'one big'
// @returns {object} data about the row cell, i.e. { char, empty, visible }
function getRowDataFromLine(line) {
  const chars = [...line];
  const extraChars = [...'\'-&']; // WoF uses them; i seent it!

  return chars.map((char) => {
    return {
      char,
      empty: char === ' ',
      visible: extraChars.includes(char) || false,
    };
  });
}


function getRowDataFromAnswerLine(answerLine, maxLength) {
  let leftGutter;
  let rightGutter;
  let rowData;
  let wiggleRoom;

  if (answerLine.length > maxLength) {
    throw new Error(`Given answer line (${answerLine}) exceeds max length (${maxLength} characters)!`);
  } else if (!answerLine.length) {
    rowData = getRowDataFromLine(' '.repeat(maxLength));
  } else {
    wiggleRoom = maxLength - answerLine.length;

    leftGutter = wiggleRoom / 2;
    rightGutter = leftGutter;

    if (wiggleRoom > 0 && wiggleRoom % 2 !== 0) {
      // if gutters are unequal, let the right side have the bigger value
      leftGutter = (wiggleRoom - 1) / 2;
      rightGutter = (wiggleRoom + 1) / 2;
    }

    rowData = getRowDataFromLine(`${' '.repeat(leftGutter)}${answerLine}${' '.repeat(rightGutter)}`);
  }

  return rowData
}


// basically the new getRowDataFromAnswer()
//
// @param {array.<string>} answer
// @returns {array.<array.<object>>} an array with 4 elements that are arrays. these arrays represent the board's
//                                   rows. each of the 4 arrays' elements are objects representing a single
//                                   cell (character) on the board.
export default function getRowDataFromAnswer(answer) {
  let firstRow = '';
  let secondRow = '';
  let thirdRow = '';
  let fourthRow = '';

  if (!Array.isArray(answer) || !answer.length) {
    throw new SyntaxError('An answer must be given as an array of arrays!');
  }

  switch (answer.length) {
    case 1:
      [secondRow] = answer;
      break;

    case 2:
      [secondRow, thirdRow] = answer;
      break;

    case 3:
      [firstRow, secondRow, thirdRow] = answer;
      break;

    default:
      [firstRow, secondRow, thirdRow, fourthRow] = answer;
  }

  return [
    getRowDataFromAnswerLine(firstRow, 12),
    getRowDataFromAnswerLine(secondRow, 14),
    getRowDataFromAnswerLine(thirdRow, 14),
    getRowDataFromAnswerLine(fourthRow, 12),
  ];
}
