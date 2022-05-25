// Dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const Log = require('./models/logs.js');
const methodOverride = require("method-override");


// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ROUTES

// Index

app.get('/logs', (req, res) => {
    Log.find({}, (error, allLogs) => {
		res.render('index.ejs', {
			logs: allLogs,
		});
	});
});

// NEW

app.get('/logs/new', (req, res) => {
    res.render('new.ejs');
});

// DELETE

app.delete("/logs/:id", (req, res) => {
    Log.findByIdAndRemove(req.params.id, (err, data) => {
        res.redirect("/logs");
    });
});

// Update
app.put("/logs/:id", (req, res) => {
    if (req.body.shipIsBroken === "on") {
        req.body.shipIsBroken = true
    } else {
        req.body.shipIsBroken = false
    }

    Log.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        },
        (error, updatedLog) => {
            res.redirect(`/logs/${req.params.id}`);
        }
    );
});

// CREATE
app.post('/logs', (req, res) => {
	if (req.body.shipIsBroken === 'on') {
		//if checked, req.body.shipIsBroken is set to 'on'
		req.body.shipIsBroken = true;
	} else {
		//if not checked, req.body.shipIsBroken is undefined
		req.body.shipIsBroken = false;
	}
	Log.create(req.body, (error, createdLog) => {
		res.redirect('/logs');
	});
});

// EDIT
app.get("/logs/:id/edit", (req, res) => {
    Log.findById(req.params.id, (error, foundLog) => {
        res.render("edit.ejs", {
            log: foundLog,
        });
    });
});

// Show
app.get('/logs/:id', (req, res) => {
	Log.findById(req.params.id, (err, foundLog) => {
		res.render('show.ejs', {
            log: foundLog,
        });
	});
});







// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`));