
const { v1: uuidv1 } = require('uuid');

var path = require("path");
var express = require("express");
const fs = require("fs");
const util = require("util");
const database = "db/db.json"
var app = express();
var PORT = process.env.PORT || 8080;
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("/api/notes", async function (req, res) {


    readFileAsync(database, "utf8").then(function (data) {
        res.json(JSON.parse(data))

    });


});


app.post("/api/notes", async function (req, res) {
    let note = req.body;

    readFileAsync(database, "utf8").then(function (data) {
        let noteArr = JSON.parse(data);
        note.id = uuidv1();
        noteArr.push(note)
        let strArr = JSON.stringify(noteArr, null, 4)

        writeFileAsync(database, strArr).then(function () {
            res.json(note)

        });

    });


});


app.delete("/api/notes/:id", async function (req, res) {

    readFileAsync(database, "utf8").then(function (data) {
        let noteID = req.params.id
        let noteArr = JSON.parse(data)

        for (let i = 0; i < noteArr.length; i++) {
            if (noteArr[i].id === noteID) {
                noteArr.splice(i, 1);
            }
        }


        let strArr = JSON.stringify(noteArr, null, 4)

        writeFileAsync(database, strArr).then(function () {
            res.json({ ok: true })

        });


    });
})

    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "/notes.html"));
    });


    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "/index.html"));
    });



    app.listen(PORT, function () {
        console.log("App listening on PORT: " + PORT);
    });



