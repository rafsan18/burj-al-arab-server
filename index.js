const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const password = "aZXjq38M9CEbx86";

const MongoClient = require("mongodb").MongoClient;
const uri =
    "mongodb+srv://hotelUser:aZXjq38M9CEbx86@cluster0.mypty.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

client.connect((err) => {
    const bookings = client.db("burjAlArab").collection("bookings");
    console.log("db connected successfully");
    // create
    app.post("/addBooking", (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking).then((result) => {
            res.send(result.insertedCount > 0);
        });
        console.log(newBooking);
    });
    // read

    app.get("/bookings", (req, res) => {
        console.log(req.query.email);
        bookings.find({ email: req.query.email }).toArray((err, documents) => {
            res.send(documents);
        });
    });
});

app.listen(port);
