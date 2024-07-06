const pool = require("../config/db");

const addBook = async (req, res) => {
  const { code, title, author, stock } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO book (code, title, author,stock) VALUES (?, ?, ?, ?)",
      [code, title, author, stock]
    );
    res.status(201).json({ message: "Book added successfully" });
    // res.status(201).json({ id: result.insertId, code, title, author, stock });
  } catch (error) {
    res.status(500).json({ error: "Error adding book" });
  }
};

const deleteBook = async (req, res) => {
  const { code } = req.body;
  try {
    await pool.query("DELETE FROM book WHERE code = ?", [code]);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting book" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM book WHERE code NOT IN (SELECT book_code FROM member_borrow)"
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching book" });
  }
};

const checkBooks = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM book");
  res.json(rows);
};

module.exports = {
  addBook,
  deleteBook,
  getAllBooks,
  checkBooks,
};
