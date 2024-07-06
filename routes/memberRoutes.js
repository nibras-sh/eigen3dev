const express = require("express");
const {
  addMember,
  deleteMember,
  MemberBorrowBook,
  MemberReturnsBook,
  checkAllMembers,
  getAllMembers,
  getMember,
} = require("../controllers/memberController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Member management
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Member check - Shows all existing members
 *     tags: [Members]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: A list of all existing members.
 *       500:
 *         description: Server error
 */
router.get("/", getAllMembers);

/**
 * @swagger
 * /members/check:
 *   get:
 *     summary: Member check - The number of books being borrowed by each member
 *     tags: [Members]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: A list of members and number of books being borrowed by each member.
 *       500:
 *         description: Server error
 */
router.get("/check", checkAllMembers);

/**
 * @swagger
 * /members/borrow:
 *   post:
 *     summary: Members borrow books
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_code:
 *                 type: string
 *                 example: M004
 *               books:
 *                 type: array
 *                 example: ["JK-45", "SHR-1"]
 *     responses:
 *       200:
 *         description: Books borrowed successfully.
 *       400:
 *         description: Bad request, invalid input provided.
 */
router.post("/borrow", MemberBorrowBook);

/**
 * @swagger
 * /members/returns:
 *   post:
 *     summary: Members return books
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_code:
 *                 type: string
 *                 example: M004
 *               books:
 *                 type: array
 *                 example: ["JK-45", "SHR-1"]
 *     responses:
 *       200:
 *         description: Books returned successfully.
 *       400:
 *         description: Bad request, invalid input provided.
 */
router.post("/returns", MemberReturnsBook);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Add a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: M001
 *               name:
 *                 type: string
 *                 example: Angga
 *     responses:
 *       200:
 *         description: Member added successfully.
 */
router.post("/", addMember);

/**
 * @swagger
 * /members:
 *   delete:
 *     summary: Delete a member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: M001
 *     responses:
 *       200:
 *         description: Member deleted successfully.
 */
router.delete("/", deleteMember);

// router.get("/specific", getMember);

module.exports = router;
