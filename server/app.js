const express = require("express")
const path = require("path")
const createError = require("http-errors")
const cookieSession = require("cookie-session")
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const FeedbackService = require("./services/feedbackService")
const SpeakerService = require("./services/speakerService")

// initializing the data services
const feedbackService = new FeedbackService("./data/feedback.json")
const speakerService = new SpeakerService("./data/speakers.json")

const routes = require("./routes")

const app = express()
const port = 3000

app.locals.siteName = "Art Meetups" // Global variable that is available throughout the app 


app.use(cookieSession({
    name: "session",
    keys: [process.env.KEY_1, process.env.KEY_2]
}))
app.set("view engine", "ejs")
app.set("views", "public")
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(async (req, res, next) => {
    try {
        const names = await speakerService.getNames()
        // this is also a global variable but it attached to every response object
        // unlike app.locals vars, this re-fetches its data. useful to keep track of 
        // changes in our database to our global variables
        res.locals.speakerNames = names
        return next()
    } catch (error) {
        return next(error)
    }
})
app.use("/", routes({feedbackService, speakerService, }))

// catch 404 and forward to error handler
app.use( (req, res, next) => {
    return next(createError(404, "File Not Found"))
})
// error handler
app.use( (err, req, res, next) => {
    res.locals.message = err.message // global error message
    const status = err.status || 500
    res.locals.status = status // global error status
    res.status(status)
    res.send("error") // error page
})

module.exports = app