const mongoose = require("mongoose")
const emailValidator = require("email-validator")
const bcrypt = require("bcrypt")
const SALT_ROUNDS = 12

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        index: {unique: true},
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: {unique: true},
        validate: {
            validator: emailValidator,
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        index: {unique: true},
        minlength: 8
    }
}, {timestamps: true})

UserSchema.pre("save", async function presave(next){
    const user = this

    if(!user.isModified("password")) return next()

    try {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS)
        user.password = hash
        return next()
    } catch (error) {
        return next(error)
    }
})

UserSchema.methods.comparePassword = async function comparePassword(userPassword){
    return bcrypt.compare(userPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)