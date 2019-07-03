/**
 *  The export from this file is specifically for transforming an answer into
 *  spec objects containing information about each character/cell that appear
 *  on the game board.
 */


/**
 *  @typedef {object} characterSpec
 *  @property {string} char    The actual character for the spec object.
 *  @property {bool}   empty   Indicates whether the cell should be considered "empty."
 *                             This is `true` when `char` is an empty/space character (`' '`).
 *  @property {bool}   visible Indicates whether or not the character should be visible
 *                             on the board. Special characters are always visible, but
 *                             all others will be set to `false` so they are not revealed
 *                             before the game starts.
 */


/**
 *  Given a single string represented a line on the game board, extract all
 *  of the individual characters from the string and create meta objects
 *  for them.
 *
 *  @param   {string} line The line as it would appear on the board (e.g. '  some clue ').
 *  @returns {array.<characterSpec>} The array's length should equal the length of the `line`.
 */
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

/**
 *  Given a raw line for an answer (i.e. non-padded string containing one or more words
 *  intended to appear in a single row on the board), process the line by padding it with
 *  spaces so that the line is centered in a string of `maxLength`. After processing is
 *  complete, obtain an array of {characterSpec}s for the line.
 *
 *  @param   {string} answerLine The non-padded (space-trimmed) line to appear in a board row.
 *  @param   {number} maxLength  The max length of the resulting line after processing. Given
 *                               the official WoF board, this should be either `12` or `14`.
 *  @returns {array.<characterSpec>}
 */
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

/**
 *  The default export for the file that implementers will use to get {characterSpec}s
 *  for all rows on the game board. The placement of the `answer` strings on the board
 *  will be determined by the number of `answer` strings provided. In general, the result
 *  on the board will be more-or-less horizontally and vertically aligned in the center
 *  of the board. The placement on the board can be spoofed by padding `answer` strings
 *  with spaces, or providing empty strings in the `answers` array.
 *
 *  @example
 *  // center/middle
 *  answer = [
 *    'second row',
 *    'third row',
 *  ];
 *
 *  // centered, but appears left-aligned due to padded spaces
 *  answer = [
 *    'i think  ',
 *    'therefore',
 *    'i am     ',
 *  ];
 *
 *  // appears right-aligned in last two rows
 *  answer = [
 *    '',
 *    '',
 *    '   who would',
 *    '     do this',
 *  ];
 *
 *
 *  @param   {array.<string>} answer The answer array. Any elements after four are ignored.
 *  @returns {array.<array.<characterSpec>>} The specs for all four rows on the board.
 */
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
