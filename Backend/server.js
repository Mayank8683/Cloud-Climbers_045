const express = require('express');
const dotenv = require('dotenv');
const api = require('./routes/route');
const connectToDB = require('./configs/db');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    next();
});

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route handlers
app.use(api);

// Default route
app.get("/", (req, res) => {
    res.json("Welcome");
});

// Start the server
const port = process.env.PORT || 9000;
const db_url = process.env.MONGODB_URI;

connectToDB(db_url) // Establish database connection before starting the server
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at ${port}`);
        });
    })
    .catch((error) => {
        console.log("Failed to connect to the database", error);
    });
