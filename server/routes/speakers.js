const express = require("express")
const router = express.Router()

module.exports = ({speakerService}) => {
    
    router.get("/", async (req, res, next) => {
        try {
            const speakers = await speakerService.getList()
            const artworks = await speakerService.getAllArtwork()
            res.json({message: "this is the speaker's index page", speakers, artworks})

        } catch (error) {
            return next(error)
        }
    })

    router.get("/:shortname", async (req, res, next) => {
        try {
            const speaker = await speakerService.getList(req.params.shortname)
            const artworks = await speakerService.getArtworkForSpeaker(req.params.shortname)
            res.json({message: `this page belongs to ${req.params.shortname}`}, speaker, artworks)
        } catch (error) {
            return next(error)
        }
    })

    
    return router
}