require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const userRouter = require('./routes/userRouter')
const eventRouter = require('./routes/eventRouter')

app.use(cors());
app.use(express.json());
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB connected");
    })
    .catch((error) => {
        console.error("DB connection error:", error);
    });

// Basic route
app.get('/', (req, res) => {
    console.log("Hello World");
    res.send("Hello World"); 
});


app.use('/api/user',userRouter)
app.use('/api/event',eventRouter)

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
