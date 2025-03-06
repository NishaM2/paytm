const express = require('express');
const zod = require("zod");
const router = express.Router();
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");


// signup
const signupSchema = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})

router.post("/signup", async (req,res) => {
    const body = req.body;
    const response = signupSchema.safeParse(body);

    if (!(response.success)) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    } 
    
    const userExist = await User.findOne({
        userName: req.body.userName
    })

    if(userExist) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await User.create(body);

    const userId = user._id;

    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId: userId
    }, jwt_secret);

    res.json({
        message: "User created successfully",
        token: token
    })
})



// signin
const signinSchema = zod.object({
    userName: zod.string().email(),
    password: zod.string().min(6)
})

router.post("/signin", async (req,res) => {
    const body = req.body;
    console.log("Request:", body)
    const response = signinSchema.safeParse(body);

    if(!response.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    
    const userExist = await User.findOne({
        userName: req.body.userName,
        password: req.body.password
    });

    console.log("user found", userExist);
    
    if(userExist) {
        const token = jwt.sign({
            userId: userExist._id
        }, jwt_secret);

        res.json({
            token: token
        })
        return;
    }
    
    res.status(411).json({
        message: "error while logging in"
    })
})




// update
const updatedSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})

router.put("/", authMiddleware , async (req,res) => {
    const body = req.body;
    const response = updatedSchema.safeParse(body);

    if (!(response.success)) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    await User.updateOne({_id: req.userId}, body);

    res.json({
        message: "User updated successfully"
    })
})




// getting list of users
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        users: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;
