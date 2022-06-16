const express = require("express")
const router = express.Router()
const passport = require("passport")
const UserModel = require("../../models/UserModel")

function redirectIfLoggedIn(req, res, next){
    if(req.user) return res.redirect("/user/account")
    return next()
}

module.exports = () => {
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login?error=true" // this passes a query parameter to the get route
    }))
    
    router.get("/login", redirectIfLoggedIn, (req, res) => {
        res.render("users/login", {
            error: req.query.error
        })
    } )

    router.get("/logout", (req, res) => {
        req.logout()
        return res.redirect("/")
    })

    router.get("/registration", redirectIfLoggedIn, async (req, res, next) => {
        try {
            res.render("users/registration", {
                success: req.query.success
            })
        } catch (error) {
            return next(error)
        }
    })

    router.post("/registration", async (req, res, next) => {
        try {
            const user = UserModel({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })

            const savedUser = await user.save

            if(savedUser) return res.redirect("/user/registration?success=true")
            return next(new Error("user was not saved successfully to the db!"))
        } catch (error) {
            return next(error)
        }
    })

    router.get("/account", (req, res, next) => {
        if (req.user) return next() // this is a middleware to check if a user exists
        return res.status(401).end() // returns an error and ends the res cycle if the req obj has no user
    },async (req, res, next) => {
        try {
            res.render("users/account", {
                user: req.user
            })
        } catch (error) {
            return next(error)
        }
    })

    return router
}