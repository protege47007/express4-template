const express = require("express")
const router = express.Router()
const speakersRoute = require("./speakers")
const feedbackRoute = require("./feedback")

module.exports = (params) => {
    const {speakerService} = params

    router.use("/", async (req, res, next) => {
        try {
            const topSpeakers = await speakerService.getList()
            const artworks = await speakerService.getAllArtwork()
            res.render("home", {topSpeakers, artworks}) 
        } catch (error) {
            return next(error)
        }
        
    })
    router.use("/speaker", speakersRoute(params))
    router.use("/feedback", feedbackRoute(params))
    
    return router
}