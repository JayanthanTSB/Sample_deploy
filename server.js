import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 2014;

app.use(express.json());
app.use(cors());
let pool;

const environment = "live";
switch (environment) {
  case "local":
    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "root",
      database: "form",
    });
    break;

  case "live":
    pool = mysql.createPool({
      host: "35.232.16.120",
      user: "root",
      password: "or3dovIa7xn'EQ<>",
      database: "form",
    });
    break;

  default:
    break;
}

app.get("/", async (req, res) => {
  try {
    const [rows, fields] = await pool.execute("SELECT * FROM user");
    console.log(rows);
    res.send({
      users: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, mobile, sex, dob, address, type } = req.body;
    const query =
      "INSERT INTO user (name, email, mobile, sex, dob, address, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [name, email, mobile, sex, dob, address, type];
    console.log(values);
    await pool.execute(query, values);
    res.send(`User added successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, mobile, sex, dob, address } = req.body;
    const query =
      "UPDATE user SET name = ?, email = ?, mobile = ?, sex = ?, dob = ?, address=?  WHERE id = ?";
    const values = [name, email, mobile, sex, dob, address, id];
    console.log(values, "backend");
    await pool.execute(query, values);
    res.send(`User updated successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Define a route to delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = "DELETE FROM user WHERE id = ?";
    const values = [id];
    console.log(values);
    await pool.execute(query, values);
    console.log(`User deleted successfully!`);
    res.send(`User deleted successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
