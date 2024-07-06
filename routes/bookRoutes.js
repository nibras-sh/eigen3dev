const express = require("express");
const {
  addBook,
  deleteBook,
  getAllBooks,
  checkBooks,
} = require("../controllers/bookController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /books/check:
 *   get:
 *     summary: Check the book - Shows all existing books and quantities
 *     tags: [Books]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: A list of books.
 *       500:
 *         description: Server error
 */
router.get("/check", checkBooks);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Check the book -  Books that are being borrowed are not counted
 *     tags: [Books]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: A list of books.
 *       500:
 *         description: Server error
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: JK-45
 *               title:
 *                 type: string
 *                 example: Harry Potter
 *               author:
 *                 type: string
 *                 example: J.K Rowling
 *               stock:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Book added successfully.
 */
router.post("/", addBook);

/**
 * @swagger
 * /books:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: string
 *                    example: JK-45
 *     responses:
 *       200:
 *         description: Book deleted successfully.
 */
router.delete("/", deleteBook);

module.exports = router;
