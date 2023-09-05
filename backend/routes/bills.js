const express = require("express");
const { Plans, paymentIntent, Subscribe, Cancel, CreateBill} = require("../controllers/Bill.js");


const router = express.Router();


router.get("/plans", Plans);
router.post("/createBill",CreateBill);
router.post("/subscribe", Subscribe);
router.post("/cancel", Cancel);


module.exports = router;


















// const router = require("express").Router();
// const Plan = require("../models/bill");



// router.post("/", async (req, res) => {
//     try {
        
//         // create new user
//         const newPlan = new Plan({
//             type: req.body.type,
//             price: req.body.price,
//             quality: req.body.quality,
//             resolution: req.body.resolution,
//             number: req.body.number,            
//         });

//         // save user and send respose
//         const plaan = await newPlan.save();
//         res.status(200).json(plaan._id);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// router.get('/', async (req, res) => {
//     try {
//         const allPlan = await Plan.find();
//         res.status(200).json(allPlan);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });




// module.exports = router;