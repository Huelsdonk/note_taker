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


// Getting the get and post note requests to work was a struggle for me. I really need to work on figuring out the async stuff. I don't understand why some things work and others don't. I tried many, many iterations. First I just used fs.writefile but couldn'tmake that work the way I wanted. Then I tried the read/write async way with a .then - that kind of worked except that I couldn't get my note array to hold more than one note. Had it globally, locally, in functions, etc... Finally, I got some help from Shaidee who had the async stuff with the try/catch. I don't really know why, but it works now. 

app.get("/api/notes", async function (req, res) {
   try {
   
    const data = await readFileAsync(database, "utf8");
        res.json(JSON.parse(data))
    
   }
   catch {
       console.log(err)
   }
});


app.post("/api/notes", async function (req, res) {
    try {
        let note = req.body;
        let data = await readFileAsync(database, "utf8");
        let noteArr = JSON.parse(data);
        
        note.id = uuidv1();
        
        noteArr.push(note)

        let strArr = JSON.stringify(noteArr, null, 4)

        await writeFileAsync(database, strArr);
        res.json(note)





    }
    catch {
        console.log("error")
    }

});



app.delete("/api/notes/:id", async function (req, res) {
    try {
   
        let data = await readFileAsync(database, "utf8");
        
        let noteID = req.params.id    
        let noteArr = JSON.parse(data)

        for (let i = 0; i < noteArr.length; i++) {
            if (noteArr[i].id === noteID) {
                noteArr.splice(i, 1);
            }            
        }


        let strArr = JSON.stringify(noteArr, null, 4)

        await writeFileAsync(database, strArr);
        res.json({ok : true})

    }
       catch {
           console.log("error")
       }
});


app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/notes.html"));
});


app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});



app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});


