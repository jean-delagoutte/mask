const mongoose = require('mongoose');
const url = process.env.MONGO_DB_CONNECTION_STRING;
console.log(url);
const connectDB = mongoose.connect(url, {
}).then(db => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error while connecting to MongoDB', err);
});