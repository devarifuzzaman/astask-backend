//Basic library import
const express = require('express');
const router = require('./src/routes/api');
const app = express();
const bodyParser = require('body-parser');

// Security Middleware library imports

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// DataBase library imports
const mongoose = require('mongoose');

// Security Middleware Implementation
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ limit: '1024mb' }));

// Body Parser Implementation
app.use(bodyParser.json());

//Request RateLimit implementation
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

//Mongo DB Connection Implementation
let URI = "mongodb+srv://<username>:<password>@cluster0.o98eu3z.mongodb.net/task";
let OPTION = { user: 'arifujjaman', pass: '@arifujjaman12', autoIndex: true };
mongoose.connect(URI, OPTION, (error) => {
 console.log("Connection Success");
 console.log(error);
});



// Routing Implementation
app.use("/api/v1", router);


// undefined routes Implementation
app.use("*", (req, res) => {
 res.status(404).json({ status: "Failed", data: "Not Found" });
});

module.exports = app;
