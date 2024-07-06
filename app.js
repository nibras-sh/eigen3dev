const express = require("express");
// const setupSwagger = require("./swagger");
const { specs, swaggerUi } = require("./swagger");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const algorhythmRoutes = require("./routes/algorhythmRoutes");
const pool = require("./config/db");

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/algorhythm", algorhythmRoutes);

const PORT = process.env.PORT || 3000;

pool
  .getConnection()
  .then(() => {
    // console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`App is running on => http://localhost:${PORT}`);
      console.log(
        `Swagger is available at => http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
