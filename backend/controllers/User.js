const User = require('../models/user.js');

const plans = {
    "Mobile" : {
    "planName" : "Mobile",
    "videoQuality" : "Good",
    "Resolution" : "480p",
    "MonthlyPrice" : "₹ 100",
    "yearlyPrice" : "₹ 1000",
    "devices" : ["Phone", "Tablet"],
    "mId" : "price_1NbzdHSErffaDKeGV2EYkHoz",
    "yId" : "price_1Nbze0SErffaDKeGD0w3ANJf"
    },
    "Basic" : {
    "planName" : "Basic",
    "videoQuality" : "Good",
    "Resolution" : "480p",
    "MonthlyPrice" : "₹ 200",
    "yearlyPrice" : "₹ 2000",
    "devices" : ["Phone", "Tablet", "Computer", "TV"],
    "mId" : "price_1NbzeSSErffaDKeG0XkPTHAS",
    "yId" : "price_1NbzejSErffaDKeGe3KrRrA6"
    },
    "Standard" : {
        "planName" : "Standard",
        "videoQuality" : "Better",
        "Resolution" : "1080p",
        "MonthlyPrice" : "₹ 500",
        "yearlyPrice" : "₹ 5000",
        "devices" : ["Phone", "Tablet", "Computer", "TV"],
        "mId" : "price_1Nc1TuSErffaDKeGRZxyNtQq",
        "yId" : "price_1Nc1VHSErffaDKeGdiD7OQCS"
    },
    "Premimum" : {
        "planName" : "Premimum",
        "videoQuality" : "Best",
        "Resolution" : "4k+HDR",
        "MonthlyPrice" : "₹ 700",
        "yearlyPrice" : "₹ 7000",
        "devices" : ["Phone", "Tablet", "Computer", "TV"],
        "mId" : "price_1Nc1UPSErffaDKeGp78A5KoV",
        "yId" : "price_1Nc1UxSErffaDKeG27W2bFsa"    
    }};
    
const register =  async (req, res) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        console.log(newUser);
    
        try {
            console.log("Backened");
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        } catch (error) {
            res.status(500).json(error);
        }
};
    

const login = async(req, res) => {
    try{
        const { email, password } = req.body;
        if(email!="" && password!=""){
            const checkExists = await User.findOne({email: email});
            if(checkExists==null){
                res.status(201).send({
                    'msg' : 'User does not exist',
                });
                return;
            } else{
                if(checkExists.password==password){
                    res.status(200).send({
                        'msg' : 'User logged in successfully',
                        name : checkExists.name,
                        email : checkExists.email,
                        current_plan : checkExists.current_plan,
                        plan_details : plans[checkExists.current_plan]!="Free" ? plans[checkExists.current_plan] : {},
                        subscriptionId : checkExists.subscriptionId,
                        cancelled : checkExists.cancelled,
                        planType : checkExists.planType,
                    });
                } else{
                    res.status(201).send({
                        'msg' : 'Incorrect Password',
                    });
                }
            }
        } else{
            res.status(400).json({
                message: "All fields are required"
            })
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            'msg' : 'Internal Server Error',
        });
    }
}

const updateCurrentPlan = async (req, res) => {
    try{
        const userExists = await User.findOneAndUpdate({email: req.body.email}, {
            $set : {
                current_plan : req.body.planName,
                subscriptionId : req.body.subscriptionId,
                planType : req.body.planType,
            }
        });
        if(userExists){
            res.status(200).send({
                'msg' : 'Current Plan Updated',
            });
        } else{
            res.status(201).send({
                'msg' : 'User does not exist',
            });
        }
    } catch(err){
        console.log(err);
        res.status(500).send({
            'msg' : 'Internal Server Error',
        });
    }
}

const getName = async (req,res) => {
    try {
        // console.log("email is",req.query.key);
        
        // ####### NOTES #########
        // IF data is send in query form then req.query.key
        // IF data is send in id then req.params.id
        // IF data is send in body then req.body.email
        const userFound = await User.findOne({email: req.query.key});
        // console.log("userfound is",userFound);
        res.status(200).json(userFound.username);
    } catch (error) {
        // console.log("got in backend catch");
        res.status(500).json(error);
    }
}

module.exports = {
    register,
    login,
    updateCurrentPlan,
    getName
}