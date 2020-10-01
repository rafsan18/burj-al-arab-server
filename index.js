const express = require("express");
const app = express();
const port = 5000;

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
    const collection = client.db("burjAlArab").collection("bookings");
    console.log("db connected successfully");
    client.close();
});

app.listen(port);
