const jwt = require('jsonwebtoken')
const User = require('../model/userSchema')

const authenticate = async (req, res, next) => {
    try {
        //console.log(req);
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token })
        if (!rootUser) {
            throw new Error("User not found")
        } else {
            req.token = token
            req.rootUser = rootUser
            console.log(rootUser);
            req.userID = rootUser._id
            next()
        }
    } catch (error) {
        res.status(401).json({ Error: "Authentication Error" })
        console.log(error);
    }
}

module.exports = authenticate