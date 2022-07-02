const mongoose=require('mongoose');
require('dotenv').config();

const {LOCAL_MONGO_URI}=process.env
const connectDB = async () => {
   await mongoose
        .connect(LOCAL_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Connected Successfully'))
        .catch((err) => console.error('Not Connected',err));
}

module.exports = connectDB;