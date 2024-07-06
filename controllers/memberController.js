const pool = require("../config/db");

const addMember = async (req, res) => {
  const { code, name } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO member (code, name, penalized_f) VALUES (?, ?, 'F')",
      [code, name]
    );
    // res.status(201).json({ id: result.insertId, code, name });
    res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding member" });
  }
};

const deleteMember = async (req, res) => {
  const { code } = req.body;
  try {
    await pool.query("DELETE FROM member WHERE code = ?", [code]);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting member" });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM member");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching members" });
  }
};
const checkAllMembers = async (req, res) => {
  try {
    // const query = `SELECT a.code,a.name,count(b.id) as borrowed_books FROM member a , member_borrow b WHERE a.code=b.member_code GROUP BY a.code,a.name`;
    const query = `SELECT a.code,a.name,(select count(b.id) FROM member_borrow b WHERE a.code=b.member_code) as borrowed_books FROM member a`;
    const [rows] = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching members" });
  }
};

const getMember = async (req, res) => {
  const { code } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM member WHERE code = ?", [
      code,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching member" });
  }
};

const MemberBorrowBook = async (req, res) => {
  const { member_code, books } = req.body;

  try {
    // Format date
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
    const proposedReturnDate = new Date(currentDate);
    proposedReturnDate.setDate(proposedReturnDate.getDate() + 7);
    const formattedProposedReturnDate = proposedReturnDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    // Check if member exists
    const checkMemberQuery = `SELECT penalized_f FROM member WHERE code = ?`;
    const [memberRows] = await pool.query(checkMemberQuery, [member_code]);
    if (memberRows.length === 0) {
      return res.status(400).json({ message: "Member does not exist." });
    }

    // Check if member is penalized
    const penalized_f = memberRows[0].penalized_f;
    if (penalized_f === "Y") {
      return res
        .status(400)
        .json({ message: "Member is penalized and cannot borrow books." });
    }

    // Check if member is borrowing more than 2 books. Or already borrow 2 books or more
    if (books.length > 2) {
      return res
        .status(400)
        .json({ message: "Cannot borrow more than 2 books." });
    }
    var checkBorrowedBookQuery = `SELECT * FROM member_borrow WHERE member_code in (?)`;
    var [borrowedBookRows] = await pool.query(checkBorrowedBookQuery, [
      member_code,
    ]);
    if (borrowedBookRows.length >= 2) {
      return res.status(400).json({
        status: false,
        message: "You already borrow 2 books.",
      });
    }

    // Check if member is penalized
    const checkPenalizedQuery = `SELECT penalized_f FROM member WHERE code = ?`;
    const [penalizedRow] = await pool.query(checkPenalizedQuery, [member_code]);
    if (
      penalizedRow.length === 0 ||
      penalizedRow[0].penalized_f.toLowerCase() == "y" ||
      penalizedRow[0].penalized_f.toLowerCase() == "t"
    ) {
      return res
        .status(400)
        .json({ message: "Member is penalized and cannot borrow books." });
    }

    // Check if books are already borrowed by other members
    const checkBorrowedQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code in (?)`;
    const [borrowedRows] = await pool.query(checkBorrowedQuery, [
      books,
      member_code,
    ]);
    if (borrowedRows.length >= 2) {
      return res.status(400).json({
        status: false,
        message: "You already borrow 2 books.",
      });
    }

    // Proceed to borrow books
    let successBooksArray = [];
    let failedBooksArray = [];
    let failedBooksMeArray = [];
    let outofstockBooksArray = [];
    const promises = books.map(async (book_code) => {
      let proceed = true;

      // Check if stock still > 0 or not
      const checkStockQuery = `SELECT stock FROM book WHERE code = ?`;
      const [stockRows] = await pool.query(checkStockQuery, [book_code]);
      if (stockRows.length === 0 || stockRows[0].stock <= 0) {
        // Out of stock
        outofstockBooksArray.push(book_code);
        proceed = false;
      } else {
        // In stock
        successBooksArray.push(book_code);
      }

      // Check if being borrowed by others
      const checkBorrowedQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code not in (?)`;
      const [borrowedRows] = await pool.query(checkBorrowedQuery, [
        book_code,
        member_code,
      ]);
      if (borrowedRows.length > 0) {
        // Borrowed by other
        failedBooksArray.push(book_code);
        successBooksArray.pop(book_code);
        proceed = false;
      }

      // Check if being borrowed by ME
      const checkBorrowedMeQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code in (?)`;
      const [borrowedMeRows] = await pool.query(checkBorrowedMeQuery, [
        book_code,
        member_code,
      ]);
      if (borrowedMeRows.length > 0) {
        // Borrowed by ME
        failedBooksMeArray.push(book_code);
        successBooksArray.pop(book_code);
        proceed = false;
      }

      if (proceed) {
        // Proceed Borrow
        const borrowBookQuery = `INSERT INTO member_borrow (member_code, book_code, borrow_date) VALUES (?, ?, ?)`;
        await pool.query(borrowBookQuery, [
          member_code,
          book_code,
          formattedCurrentDate,
        ]);

        // Decrease stock
        const decreaseStockQuery = `UPDATE book SET stock = stock - 1 WHERE code = ?`;
        await pool.query(decreaseStockQuery, [book_code]);
      }
    });

    await Promise.all(promises);

    let failedBookMsg = "";
    if (failedBooksArray.length == 1) {
      failedBookMsg = ` Books ${failedBooksArray.join(
        ", "
      )} are still borrowed by others.`;
    } else if (failedBooksArray.length == 2) {
      // if all books are out of borrowed
      return res.status(400).json({
        status: false,
        message: `All ${outofstockBooksArray.join(
          ", "
        )} books being borrowed by others`,
      });
    }

    let failedBookMeMsg = "";
    if (failedBooksMeArray.length == 1) {
      failedBookMeMsg = ` You still borrow book ${failedBooksMeArray.join(
        ", "
      )}.`;
    } else if (failedBooksMeArray.length == 2) {
      // if all books are out of borrowed
      return res.status(400).json({
        status: false,
        message: `You already borrowed all ${failedBooksMeArray.join(
          ", "
        )} books`,
      });
    }

    let outofstockBookMsg = "";
    if (outofstockBooksArray.length == 1) {
      outofstockBookMsg = ` Books ${outofstockBooksArray.join(
        ", "
      )} are out of stock.`;
    } else if (outofstockBooksArray.length == 2) {
      // if all books are out of stock
      return res.status(400).json({
        status: false,
        message: `All ${outofstockBooksArray.join(
          ", "
        )} books are out of stock`,
      });
    }

    return res.status(200).json({
      status: true,
      message: `${member_code} borrowed books ${successBooksArray.join(
        ", "
      )} successfully. Please return the book before ${formattedProposedReturnDate}, or you will be penalized. Member with a penalty cannot borrow the book for 3 days.${failedBookMsg}${outofstockBookMsg}${failedBookMeMsg}`,
    });
  } catch (error) {
    console.error("Error borrowing books:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const MemberReturnsBook = async (req, res) => {
  const { member_code, books } = req.body;
  const currentDate = new Date();
  let borrowDate;
  let returnDueDate;
  let formattedReturnDueDate;

  try {
    // Check if member exists
    const checkMemberQuery = `SELECT penalized_f FROM member WHERE code = ?`;
    const [memberRows] = await pool.query(checkMemberQuery, [member_code]);
    if (memberRows.length === 0) {
      return res.status(400).json({ message: "Member does not exist." });
    }

    // Proceed to borrow books
    let successBooksArray = [];
    let failedBooksArray = [];
    const promises = books.map(async (book_code) => {
      let proceed = true;
      // If book really being borrowed by ME
      const checkBorrowedMeQuery = `SELECT * FROM member_borrow WHERE book_code IN (?) and member_code in (?)`;
      const [borrowedMeRows] = await pool.query(checkBorrowedMeQuery, [
        book_code,
        member_code,
      ]);
      if (borrowedMeRows.length > 0) {
        // Borrowed by ME
        // If returned more than 7 days, penalized. Calculate 7 days after the borrow date
        borrowDate = new Date(borrowedMeRows[0].borrow_date);
        returnDueDate = new Date(borrowDate);
        returnDueDate.setDate(returnDueDate.getDate() + 7);
        formattedReturnDueDate = returnDueDate.toISOString().slice(0, 10);

        // Check if today is past the return due date
        if (currentDate > returnDueDate) {
          const penalizedMemberQuery = `UPDATE member SET penalized_f = 'Y', penalized_date = CURRENT_DATE() WHERE code = ?`;
          await pool.query(penalizedMemberQuery, [member_code]);
        }
        successBooksArray.push(book_code);
      } else {
        failedBooksArray.push(book_code);
        proceed = false;
      }

      if (proceed) {
        // Proceed Return
        // Remove the book from member_borrow
        const returnBookQuery = `DELETE FROM member_borrow WHERE member_code = ? AND book_code = ?`;
        await pool.query(returnBookQuery, [member_code, book_code]);

        // Increase the stock of the book
        const increaseStockQuery = `UPDATE book SET stock = stock + 1 WHERE code = ?`;
        await pool.query(increaseStockQuery, [book_code]);
      }
    });

    await Promise.all(promises);

    let failedBookMsg = "";
    if (failedBooksArray.length == 1) {
      failedBookMsg = ` Books ${failedBooksArray.join(
        ", "
      )} are not being borrowed by member.`;
    } else if (failedBooksArray.length == 2) {
      // all books not being borrowed
      return res.status(400).json({
        status: false,
        message: `All ${failedBooksArray.join(
          ", "
        )} books are not being borrowed by member.`,
      });
    }
    if (successBooksArray.length == 0) {
      return res.status(400).json({
        status: false,
        message: `All ${failedBooksArray.join(
          ", "
        )} books are not being borrowed by member.`,
      });
    }

    return res.status(200).json({
      status: true,
      message: `The book ${successBooksArray.join(
        ", "
      )} was returned successfully by ${member_code}.${failedBookMsg}`,
    });
  } catch (error) {
    console.error("Error borrowing books:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  addMember,
  MemberBorrowBook,
  MemberReturnsBook,
  checkAllMembers,
  deleteMember,
  getAllMembers,
  getMember,
};
