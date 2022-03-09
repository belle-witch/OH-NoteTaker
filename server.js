// Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 5500;

const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// get notes to save into db.json
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  // add get post here
  app.post("api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const addNotes = req.body;
    addNotes.id = uuid.v4();
    notes.push(addNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    res.json(notes);
  });
});

// Use apiRoutes
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`OH Note Taker on port ${PORT}!`);
});
