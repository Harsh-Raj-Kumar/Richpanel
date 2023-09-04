const express = require("express");
const { register, login, updateCurrentPlan, getName} = require("../controllers/User.js");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/updateCurrentPlan", updateCurrentPlan);
// router.post("/",getName);
router.get("/",getName);

module.exports = router;


















// const router = require("express").Router();
// const User = require("../models/user");
// const bcrypt = require('bcrypt');

// //register

// router.post("/register", async (req, res) => {
//     try {
//         // generate new password
//         const salt = await bcrypt.genSalt(10);
//         // it will take my password and hash with salt
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);
//         // create new user
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//         });

//         // save user and send respose
//         const usser = await newUser.save();
//         res.status(200).json(usser._id);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });



// // login

// // router.post("/login", async (req, res) => {
// //     try {
// //         // find user
// //         const usser = await User.findOne({ username: req.body.username });
// //         !usser && res.status(400).json("invalid credentials");

// //         // validate password
// //         const validPassword = await bcrypt.compare(req.body.password, usser.password);
// //         !validPassword && res.status(400).json("invalid credentials");

// //         // send response
// //         res.status(200).json({ _id: usser._id, username: usser.username });
// //     } catch (err) {
// //         res.status(500).json(err);
// //     }
// // });
// router.post("/login", async (req, res) => {
//     try {
//         //find user
//         const foundUser = await User.findOne({ email: req.body.email });
//         // console.log({ foundUser })

//         if (foundUser) {
//             //if foundUser: compare entered password to stored/foundUser password.
//             const validPassword = await bcrypt.compare(
//                 req.body.password,
//                 foundUser.password
//             );
//             if (validPassword) {
//                 //if both passwords match:
//                 res.status(200).json({ _id: foundUser._id, username: foundUser.username });
//             } else {
//                 //if both passwords dont match:
//                 res.status(400).json("invalid credentials");
//             }
//         } else {
//             //if !foundUser:
//             res.status(400).json("invalid credentials");
//         }

//     } catch (error) {
//         res.status(500).json({ error, test: 'test' });
//     }
// });


// module.exports = router;