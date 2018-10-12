// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var currentReservations = [];

var waitingList = [];

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/tables", function (req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

app.get("/reservations", function (req, res) {
    res.sendFile(path.join(__dirname, "reservation.html"));
});

// Displays all currentReservations
app.get("/api/tables", function (req, res) {
    return res.json(currentReservations);
});

// Displays all currentReservations
app.get("/api/waitlist", function (req, res) {
    return res.json(waitingList);
});

// Displays a single customer, or returns false
app.get("/api/tables/:customer", function (req, res) {
    var chosen = req.params.customer;

    console.log(chosen);

    for (var i = 0; i < currentReservations.length; i++) {
        if (chosen === currentReservations[i].routeName) {
            return res.json(currentReservations[i]);
        }
    }

    return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/tables", function (req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body-parser middleware
    var newReservation = req.body;

    // Using a RegEx Pattern to remove spaces from newReservation
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newReservation.routeName = newReservation.customerName.replace(/\s+/g, "").toLowerCase();

    console.log(newReservation);

    if (currentReservations.length < 5) {
        currentReservations.push(newReservation);
    } else {
        waitingList.push(newReservation);
    }

    res.json(newReservation);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});