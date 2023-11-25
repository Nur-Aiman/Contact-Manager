const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
require('dotenv').config()

module.exports = () => {
    mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('mongo connected')
        })
        .catch((err) => {
            console.log('failed to connect')
        })
}