const passport = require("passport")
const LocalStrategy = require("passport-local")
const app = require("../app")
const UserModel = require("../models/userModel")


// new LocalStrategy({username: "email"}) is modified to use the email gotten from req.body
// as the username instead of the body.. if you want to use the username "new LocalS(blank)"
app.use(new LocalStrategy({usernameField: "email"}, async (username, password, done) => {
    try {
        const user =  await UserModel.findOne({email: username}).exec()
        // done() is like next() but here it takes in 3 args
        // 1) error message
        // 2) user
        // 3) option? :which means any other parameter we want to add 
        if(!user) return done(null, false, {message: "Email or Password is incorrect"})

        // user.comparePassword method is coming from the user model schema
        const passwordOk = await user.comparePassword(password)
        if(!passwordOk) return done(null, false, {message: "Email or Password is incorrect"})

        // if the user exists and password matches, then done(null, user) returns the user
        return done(null, user)  
    } catch (error) {
        return done(error)
    }
}))

// user._id is the id given to it in the database
passport.serializeUser( (user, done) => done(null, user._id))

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById({id}).exec()

        return done(null, user)
    } catch (error) {
        return done(error)
    }
})

module.exports =  {
    initialize: passport.initialize(),
    session: passport.session(),
    setUser: (req, res, next) => {
        res.locals.user =req.user
        return next()
    }
}