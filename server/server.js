const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(express.json());
// app.use(bodyParser.json());
app.use(cors());

const multer = require("multer")
const upload = multer();
// Dummy user data
let users = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 23 },
  { id: 2, name: "Jane Doe", email: "jane@example.com", age: 40 },
  { id: 3, name: "zini raja", email: "zini@raja.com", age: 23 },
];

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

// Get all users
app.get("/user", (req, res) => {
  res.json(users);
});

// Get user by ID
app.get("/user/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// Create a new user
app.post("/user",upload.single("file"), (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user by ID
app.put("/user/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updateUser = req.body;
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updateUser };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete user by ID
app.delete("/user/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.put("/test-binary", upload.single("file"), (req, res) => {
  console.log(req.file, "Binary data received");
  res.status(200).json({ message: "Binary data received successfully" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
