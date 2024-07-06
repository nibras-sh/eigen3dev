# eigen3dev
-------------------------
### Table Of Content
- [Intruduction](#Introduction)
- [Installation & Deploy](#Installation)
- [Swagger](#Swagger)
- [Testing](#Testing)
    - [Backend Test Case](#backend-test-case)
    - [Algorhythm Test](#algorhythm-test)
- [Footnote](#footnote)

### Introduction
Welcome to the **eigen3dev** test. The app was build using [Express JS](https://expressjs.com/) framework that already contain two projects, Backend Test Case and Algorhythm Test. The App also use [Swagger](https://swagger.io/) as API Documentation, and use [MySQL](https://www.mysql.com/) as Database. DDD Pattern also used as software design and contain unit testing.

### Installation
- Clone from Github
    ```bash
    git clone https://github.com/nibras-sh/eigen3dev.git
    ```
- Install dependencies
    ```bash
    npm install
    ```
- Run App
    ```bash
    node app.js
    ```
    ---
- Setup Database
        - Create database named `eigen3dev`
        - Import database from `/database` folder and file named `eigen3dev.sql`

### Swagger
To see API documentation using [`Swagger`](https://swagger.io/) , access below :
```bash
http://localhost:3000/api-docs
```
### Testing
#### Backend Test Case
1. Check the book - Shows all existing books and quantities :
    ```bash
    GET http://localhost:3000/books/check
    ```
2. Check the book - Books that are being borrowed are not counted
    ```bash
    GET http://localhost:3000/books
    ```
3. [Added Functionality] - Add new book
    ```bash
    POST http://localhost:3000/books
    ```
4. [Added Functionality] - Delete a book
    ```bash
    DELETE http://localhost:3000/books
    ```
    ---
5. Member check - Shows all existing members
    ```bash
    GET http://localhost:3000/members
    ```
6. Member check - The number of books being borrowed by each member
    ```bash
    GET http://localhost:3000/members/check
    ```
7. Members borrow books
    ```bash
    POST http://localhost:3000/members/borrow
    ```
8. Members return books
    ```bash
    POST http://localhost:3000/members/returns
    ```
9. [Added Functionality] - Add new member
    ```bash
    POST http://localhost:3000/members
    ```
10. [Added Functionality] - Delete a member
    ```bash
    DELETE http://localhost:3000/members
    ```
#### Algorhythm Test
1. Test 1 - Reverse the alphabet with a fixed number at the end of the word
    ```bash
    POST http://localhost:3000/algorhythm/test1
    ```
2. Test 2 - Find the longest word in a sentence
    ```bash
    POST http://localhost:3000/algorhythm/test2
    ```
3. Test 3 - Count occurrences of QUERY words in INPUT array
    ```bash
    POST http://localhost:3000/algorhythm/test3
    ```
4. Test 4 - Subtract the sum of the diagonals of an NxN matrix
    ```bash
    POST http://localhost:3000/algorhythm/test4
    ```

**Note :** I added another functionality to the app such as :
- Readable date format if member successfully borrowing books.
- Borrowing member logics such as check member exists, is penalized, count books borrowed, already borrowed or not, check stock, increase & decrease book's stock, validation if books being borrowed, ect.

If there's more time, it's better to complete the logical borrowing and returning book process, and more validation process to avoid human error and works as a failsafe of the App.

---

### Footnote

The app was intentionally build to complete Technical Test at PT. EIGEN TRI MATHEMA. Appreciate if anyone not share the project to others and/or commercial purposes.

Contact : 24nibras@gmail.com
