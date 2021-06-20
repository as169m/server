const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
require('../db/conn')
const User = require('../model/userSchema')

const authenticate = require('../middleware/authenticate')

router.get("/", (req, res) => {
    res.send("Server says Hiii")
});

router.get("/contact", (req, res) => {
    res.send("Contact says Hiii")
});

router.post("/register", async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body

    if (!name || !email || !phone || !work || !password || !cpassword) {
        res.status(402).json({ Error: "Please fill all fields" })
    }
    if (password !== cpassword) {
        res.status(402).json({ Error: "Confirm password do not match" })
    }
    try {
        const userExists = await User.findOne({ email })
        console.log(userExists)
        if (userExists) {
            res.status(402).json({ Error: "Email id already exists" })
        }
        else {
            const user = new User({ name, email, phone, work, password, cpassword })
            await user.save()
            res.status(201).json({ Message: "User successfully registered" })
        }
    } catch (err) {
        res.status(402).json({ Error: err })
    }
})

router.post("/login", async (req, res) => {
    let token;
    try {
        const userFound = await User.findOne({ email: req.body.email });
        if (userFound) {
            const isMatch = await bcrypt.compare(req.body.password, userFound.password)

            if (isMatch) {
                token = await userFound.generateAuthToken()
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(201).json({ Message: "User logged in" })
            } else {
                res.status(401).json({ Error: "Invalid username or password" })
            }
        } else {
            res.status(402).json({ Error: "Login error" })
        }
    } catch (error) { }
})

router.get("/about", authenticate, (req, res) => {
    console.log(req.rootUser);
    res.send(req.rootUser)
});

module.exports = router;