const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,

    },
    phone: {
        required: true,
        type: Number
    },
    work: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    cpassword: {
        required: true,
        type: String
    },
    tokens: [
        {
            token: {
                required: true,
                type: String
            }
        }
    ]
});

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    clog
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        console.log(`Error`, error);
    }
}

const User = mongoose.model("USER", userSchema)

module.exports = User;