const express = require("express")
const {check, validationResult} = require("express-validator")
const router = express.Router()

// sanitizing our form inputs from injection attacks and ensuring we have data to operate with
const validationConstraints = [
    check("name").trim.isLength({min: 3}).escape().withMessage("A name is required"),
    check("email").trim.isEmail().normalizeEmail().withMessage("A valid email is required"),
    check("title").trim.isLength({min: 5}).escape().withMessage("A title is required"),
    check("message").trim.isLength({min: 5}).escape().withMessage("A message is required"),
]

module.exports = ({feedbackService}) => {
    
    router.get("/", async (req, res, next) => {
        try {
            const feedbacks = await feedbackService.getList()
            const errors = req.session.feedback? req.session.feedback.errors : false
            const successMsg = req.session.feedback? req.session.feedback.message : false
            req.session.feedback = {}

            res.json({message: "this is the feedback 's index page", feedbacks, errors, successMsg})
        } catch (error) {
            return next(error)
        }
    })

    router.post("/", validationConstraints, async (req, res, next) => {
        try {
            const errors = validationResult(req) //this checks for errors from the constraints
        
            if(!errors.isEmpty()){ // if there are errors from the req.body validation constraints
                req.session.feedback = {
                    errors: errors.array() // returns an array of errors
                }

                return res.redirect("/feedback")
            }

            const {name, email, title, message} = req.body
            await feedbackService.addEntry(name, email, title, message)
            req.session.feedback = {
                message: "Thank you for your feedback!"
            }
            res.json({message: "message received!"})
        } catch (error) {
            return next(error)
        }
    })

    router.post("/api", validationConstraints, async (req,res, next) => {
        try {
            const errors = validationResult(req) //this checks for errors from the constraints
        
            if(!errors.isEmpty()) return res.json({errors: errors.array() })

            const {name, email, title, message} = req.body
            await feedbackService.addEntry(name, email, title, message)

            const feedback = await feedbackService.getList()
            return res.json({successMsg: "message received!", feedback})
        } catch (error) {
            return next(error)
        }
    })
    return router
}