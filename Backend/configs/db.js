const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // or false

const connectToDB = async (db_url) => {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
        throw error;
    }
};

module.exports = connectToDB;
