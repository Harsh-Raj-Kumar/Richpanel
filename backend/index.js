// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require('morgan');
const path = require('path');
const app = express();
const userRoute = require("./routes/users.js");
const userBill = require("./routes/bills.js");
const PORT = process.env.PORT || 8800;

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("mongodb Connected");
}).catch((err) => {
    console.log(err);
})

app.use(express.json());
app.use(cors());

app.use(morgan("common"));

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));

app.use("/api/users", userRoute);
app.use("/api/bills", userBill);


// app.use(express.static(path.join(__dirname, './frontend/build')));
// app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/.frontend/build/index.html'));
// });


app.listen(PORT,()=> {
    console.log("Backend server is running : ",PORT);
})

