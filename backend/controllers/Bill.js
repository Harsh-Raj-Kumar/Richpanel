const stripe = require('stripe')('sk_test_51Nj2QSSHOu8Dft9pkKKnbHbsodsSozVm1tqv27ZmNkWkRJEBBkgYvLKDnoxdzcyPjzrJwcZJlW7z1OAPn6M82QSg00cAiSnKfM');
const User = require('../models/user.js');
const Bill = require('../models/bill.js');

const Plans = async (req, res) => {
    try{
        console.log("Billing details returned");
        res.status(200).send({
            'msg' : 'Billing Details',
            "plans" : [
                {
                    "planName" : "Mobile",
                    "videoQuality" : "Good",
                    "Resolution" : "480p",
                    "MonthlyPrice" : "₹ 100",
                    "yearlyPrice" : "₹ 1000",
                    "devices" : ["Phone", "Tablet"],
                    "mId" : "price_1NmtU9SHOu8Dft9pklopgCEO",
                    "yId" : "price_1Nmub0SHOu8Dft9pDU645q5m"
                },{
                    "planName" : "Basic",
                    "videoQuality" : "Good",
                    "Resolution" : "480p",
                    "MonthlyPrice" : "₹ 200",
                    "yearlyPrice" : "₹ 2000",
                    "devices" : ["Phone", "Tablet", "Computer", "TV"],
                    "mId" : "price_1NmubCSHOu8Dft9prQ5AM5ud",
                    "yId" : "price_1NmubXSHOu8Dft9pYp66FV0x"
                },{
                    "planName" : "Standard",
                    "videoQuality" : "Better",
                    "Resolution" : "1080p",
                    "MonthlyPrice" : "₹ 500",
                    "yearlyPrice" : "₹ 5000",
                    "devices" : ["Phone", "Tablet", "Computer", "TV"],
                    "mId" : "price_1NmubnSHOu8Dft9paAponoaT",
                    "yId" : "price_1NmucMSHOu8Dft9psvhpbhCr"
                },{
                    "planName" : "Premium",
                    "videoQuality" : "Best",
                    "Resolution" : "4k+HDR",
                    "MonthlyPrice" : "₹ 700",
                    "yearlyPrice" : "₹ 7000",
                    "devices" : ["Phone", "Tablet", "Computer", "TV"],
                    "mId" : "price_1NmuerSHOu8Dft9pXBMdQT7x",
                    "yId" : "price_1NmufBSHOu8Dft9pyeCB0wgy"
                }
            ]
        });
    } catch(err){
        console.log(err);
        res.status(500).send({
            'msg' : 'Internal Server Error',
        })
    }
}


// Stripe
const Subscribe = async (req, res) => {
    const { name, email, paymentMethod, priceId} = req.body;
    // console.log("Details came in backend inside subscribe",name, email, paymentMethod);
    try{
        
        const customer = await stripe.customers.create({
            email,
            name,
            payment_method: paymentMethod,
            invoice_settings: { default_payment_method: paymentMethod },
        });
        
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ 
                price: priceId
            }],
            payment_settings: {
                payment_method_types: ["card"],
                save_default_payment_method: "on_subscription",
              },
            expand: ["latest_invoice.payment_intent"],
        });

        // console.log("After Subscription client_secret",subscription.latest_invoice.payment_intent.client_secret)

        res.status(200).send({
            message: "Subscription successfully initiated",
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
            subscriptionId : subscription.id,
        });


    } catch(err){
        console.log(err);
        res.status(500).send({
            'msg' : 'Internal Server Error',
        });
    }
}

const Cancel = async (req, res) => {

    const subscription = await stripe.subscriptions.update(req.body.subscriptionId, {
        cancel_at_period_end: true,
    });

    const up = await User.findOneAndUpdate({email: req.body.email}, {
        $set: {
            subscriptionId: "",
            cancelled : true,
        }
    })
    
    if(subscription && up){
        res.status(200).send({
            message: "Subscription cancelled successfully",
        });
    } else{
        res.status(404).send({
            message: "Subscription cancellation failed",
        });
    }
}

const CreateBill = async (req, res) => {
    // const { email, amount, plan, paymentId} = req.body;
    const newBill = new Bill({
        email : req.body.email,
        amount : req.body.amount,
        plan : req.body.plan,
        payment_id : req.body.payment_id
    });
    // console.log("Inside backend Bill",newBill);
    try {
        const savedBill = await newBill.save();
        res.status(200).json(savedBill);        
    }catch(err) {
        res.status(500).json(err);
    }
}


module.exports = {
    Plans,
    Subscribe,
    Cancel,
    CreateBill
}