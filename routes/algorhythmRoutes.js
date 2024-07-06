// algorhythmRoutes.js
const express = require("express");
const {
  reverseStringWithFixedNumber,
  findLongestWord,
  countOccurrences,
  subtractDiagonals,
} = require("../controllers/algorhythmController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Algorhythm Test
 *   description: Algorhythm Test
 */

/**
 * @swagger
 * /algorhythm/test1:
 *   post:
 *     summary: Reverse the alphabet with a fixed number at the end of the word
 *     tags: [Algorhythm Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               string:
 *                 type: string
 *                 example: NEGIE1
 *     responses:
 *       200:
 *         description: Reversed string.
 */
router.post("/test1", reverseStringWithFixedNumber);

/**
 * @swagger
 * /algorhythm/test2:
 *   post:
 *     summary: Find the longest word in a sentence
 *     tags: [Algorhythm Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sentence:
 *                 type: string
 *                 example: I really enjoy working on algorithm problems
 *     responses:
 *       200:
 *         description: Longest word in the sentence.
 */
router.post("/test2", findLongestWord);

/**
 * @swagger
 * /algorhythm/test3:
 *   post:
 *     summary: Count occurrences of QUERY words in INPUT array
 *     tags: [Algorhythm Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['xc', 'dz', 'bbb', 'dz']
 *               query:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['bbb', 'ac', 'dz']
 *     responses:
 *       200:
 *         description: Array of counts.
 */
router.post("/test3", countOccurrences);

/**
 * @swagger
 * /algorhythm/test4:
 *   post:
 *     summary: Subtract the sum of the diagonals of an NxN matrix
 *     tags: [Algorhythm Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matrix:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 example: [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
 *     responses:
 *       200:
 *         description: Result of subtracting the diagonals.
 */
router.post("/test4", subtractDiagonals);

module.exports = router;
