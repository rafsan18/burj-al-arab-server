const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const admin = require("firebase-admin");

const port = 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const serviceAccount = require("./burj-al-arab-dc701-firebase-adminsdk-pwhdk-126df3b9a2.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://burj-al-arab-dc701.firebaseio.com",
});

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
    //console.log("db connected successfully");
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
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith("Bearer ")) {
            const idToken = bearer.split(" ")[1];
            console.log({ idToken });
            admin
                .auth()
                .verifyIdToken(idToken)
                .then(function (decodedToken) {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    console.log({ tokenEmail, queryEmail });
                    if (tokenEmail == req.query.email) {
                        bookings
                            .find({ email: req.query.email })
                            .toArray((err, documents) => {
                                res.send(documents);
                            });
                    }
                })
                .catch(function (error) {
                    // Handle error
                });
        }
    });
});

app.listen(port);
