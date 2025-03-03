const express = require('express');
const zod = require("zod");
const router = express.Router();
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");

const signupSchema = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})

router.post("/signup", async (req,res) => {
    const body = req.body;
    const response = signupSchema.safeparse(body);

    if (!(response.success)) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    } 
    
    const userExist = await User.findOne({
        userName: req.body.userName
    })

    if(userExist) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await User.create(body);

    const userId = user._id;

    const token = jwt.sign({
        userId: userId
    }, jwt_secret);

    res.json({
        message: "User created successfully",
        token: token
    })
})



const signinSchema = zod.object({
    userName: zod.string().email(),
    password: zod.string().min(6)
})

router.post("/signin", async (req,res) => {
    const body = req.body;
    const response = signinSchema.safeparse(body);

    if(!(response.success)) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    
    const userExist = await User.findOne(body);

    if(userExist) {
        const token = jwt.sign({
            userId: userExist._id
        }, jwt_secret);

        res.json({
            token: token
        })
    }
    
    res.json(411).json({
        message: "User does not exist"
    })
})


module.exports = router;
