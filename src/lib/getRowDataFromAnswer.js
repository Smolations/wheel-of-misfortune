function getLineFromWords(words, maxLength) {//console.log('getLineFromWords(%o, %o)', words, maxLength)
  const trimmedLine = words.join(' ');
  const excess = maxLength - trimmedLine.length;
  let leftGutter = excess / 2;
  let rightGutter = leftGutter;

  if (excess % 2 !== 0) {
    // if gutters are unequal, let the right side have the bigger value
    leftGutter = (excess - 1) / 2;
    rightGutter = (excess + 1) / 2;
  }
  // console.log('trimmedLine: [%o]\nexcess: %o\nleftGutter: %o\nrightGutter: %o', trimmedLine, excess, leftGutter, rightGutter)

  return `${' '.repeat(leftGutter)}${trimmedLine}${' '.repeat(rightGutter)}`;
}


function wordsWithGutter(wordArr, gutterWidthh) {
  const gutter = ' '.repeat(gutterWidthh);
  return `${gutter}${wordArr.join(' ')}${gutter}`;
}


function getWordsAsRows(answer, columns, columnGutters) {
  const words = answer.split(' ');
  const wordsAsRows = [];

  let currentRowWords = [];
  let currentWord;

  while (words.length) {
    currentWord = words.shift();
    currentRowWords.push(currentWord);

    if (wordsWithGutter(currentRowWords, columnGutters).length > columns) {
      // new word won't fit in current row
      words.unshift(currentRowWords.pop());
      wordsAsRows.push(currentRowWords);
      currentRowWords = [];
    } else if (!words.length) {
      // this is the last word for processing
      wordsAsRows.push(currentRowWords);
    }
  }

  return wordsAsRows;
}


function getRowDataFromLine(rowLine) {
  const chars = [...rowLine];

  return chars.map((char) => {
    return {
      char,
      empty: char === ' ',
      visible: false,
    };
  });
}


export default function getRowDataFromAnswer(answer, numColumns, numGutterColumns) {
  const wordsAsRows = getWordsAsRows(answer, numColumns, numGutterColumns);

  return wordsAsRows
    .map(rowWords => getLineFromWords(rowWords, numColumns))
    .map(getRowDataFromLine);
}
