const stripe = require('stripe')('sk_test_51KCJrzSErffaDKeGy6S369jDMEszJ3UDNkB9ed6nqdRieuoLP6NQOgAJ1GgcUBRDBUM8n63PP4ZO12iW9jWqUS5W00XqSWNuGM');
const User = require('../models/user.js');

const getLatestOffers = async (req, res) => {
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
                    "mId" : "price_1NbzdHSErffaDKeGV2EYkHoz",
                    "yId" : "price_1Nbze0SErffaDKeGD0w3ANJf"
                },{
                    "planName" : "Basic",
                    "videoQuality" : "Good",
                    "Resolution" : "480p",
                    "MonthlyPrice" : "₹ 200",
                    "yearlyPrice" : "₹ 2000",
                    "devices" : ["Phone", "Tablet", "Computer", "TV"],
                    "mId" : "price_1NbzeSSErffaDKeG0XkPTHAS",
                    "yId" : "price_1NbzejSErffaDKeGe3KrRrA6"
                },{
                    "planName" : "Standard",
                    "videoQuality" : "Better",
                    "Resolution" : "1080p",
                    "MonthlyPrice" : "₹ 500",
                    "yearlyPrice" : "₹ 5000",
                    "devices" : ["Phone", "Tablet", "Computer", "TV"],
                    "mId" : "price_1Nc1TuSErffaDKeGRZxyNtQq",
                    "yId" : "price_1Nc1VHSErffaDKeGdiD7OQCS"
                },{
                    "planName" : "Premimum",
                    "videoQuality" : "Best",
                    "Resolution" : "4k+HDR",
                    "MonthlyPrice" : "₹ 700",
                    "yearlyPrice" : "₹ 7000",
                    "devices" : ["Phone", "Tablet", "Computer", "TV"],
                    "mId" : "price_1Nc1UPSErffaDKeGp78A5KoV",
                    "yId" : "price_1Nc1UxSErffaDKeG27W2bFsa"
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


const paymentIntent = async(req, res) => {
    try{
        const intent = await stripe.paymentIntents.create({
            amount: parseInt(req.query.amount.split('₹')[1].split(' ')[1])*100,
            currency: 'inr',
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
          }); // ... Fetch or create the PaymentIntent
        res.status(200).send({client_secret: intent.client_secret});  
    } catch(err){
        console.log(err);
        console.log("Stripe is down");
    }
}

const subscribe = async (req, res) => {
    try{
        const { name, email, paymentMethod, priceId} = req.body;
        console.log(name, email, paymentMethod);
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

        console.log(subscription.latest_invoice.payment_intent.client_secret)

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

const cancel = async (req, res) => {

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
module.exports = {
    getLatestOffers,
    paymentIntent,
    subscribe,
    cancel,
}