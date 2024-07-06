// algorhythmController.js

// Test 1: Reverse the alphabet with a fixed number at the end of the word
const reverseStringWithFixedNumber = (req, res) => {
  const { string } = req.body;
  const number = string.match(/\d+$/)[0];
  const alphabets = string
    .slice(0, -number.length)
    .split("")
    .reverse()
    .join(""); // Reverse the alphabets
  const result = `${alphabets}${number}`;
  return res.status(200).json({ result });
};

// Test 2: Find the longest word in the sentence
const findLongestWord = (req, res) => {
  const { sentence } = req.body;
  const words = sentence.split(" ");
  const longestWord = words.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    ""
  );
  return res.status(200).json({ longestWord, length: longestWord.length });
};

// Test 3: Count occurrences of QUERY words in INPUT array
const countOccurrences = (req, res) => {
  const { input, query } = req.body;
  const result = query.map((q) => input.filter((word) => word === q).length);
  return res.status(200).json({ result });
};

// Test 4: Subtract the sum of the diagonals of an NxN matrix
const subtractDiagonals = (req, res) => {
  const { matrix } = req.body;
  const n = matrix.length;
  let firstDiagonalSum = 0;
  let secondDiagonalSum = 0;

  for (let i = 0; i < n; i++) {
    firstDiagonalSum += matrix[i][i];
    secondDiagonalSum += matrix[i][n - i - 1];
  }

  const result = firstDiagonalSum - secondDiagonalSum;
  return res.status(200).json({ result });
};

module.exports = {
  reverseStringWithFixedNumber,
  findLongestWord,
  countOccurrences,
  subtractDiagonals,
};
