const express = require("express")
const router = express.Router()
const UserModel = require("../../models/UserModel")

module.exports = () => {
    router.get("/registration", async (req, res, next) => {
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

    router.get("/account", async (req, res, next) => {
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