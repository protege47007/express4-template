const fs =require("fs")
const util = require("util")

// to use async/await with fs.readFile, util.promisify gives us that
const readFile = util.promisify(fs.readFile)
// const writeFile = util.promisify(fs.writeFile)

// 
class SpeakerService{
    constructor(dataFile){
        this.dataFile = dataFile
    }

    async getNames(){
        const data = await this.getData()

        // we are using the map function to transform the data arrray into another array
        return data.map(speaker => ({name: speaker.name, shortName: speaker.shortName}))
    }

    async getAllArtwork(){
        const data = await this.getData()

        // array.reduce is used to traverse all speaker elements and create an array 
        // that contains all artworks
        const artwork = data.reduce( (prev, curr) => {
            if(curr.artwork){
                prev = [...prev, ...curr.artwork]

            }
            return acc
        }, [])

        return artwork

    }

    async getArtworkForSpeaker(shortname){
        const data = await this.getData()
        
        const speaker = data.find(speaker => {
            if(speaker.shortName === shortname) return speaker
        })

        if(!speaker || !speaker.artwork) return null

        return speaker.artwork
    }
    
    async getSpeaker(shortname){
        const data = await this.getData()
        
        const speaker = data.find(speaker => {
            if(speaker.shortName === shortname) return speaker
        })

        if(!speaker) return null

        return {
            title: speaker.title,
            name: speaker.name,
            description: speaker.description,
            shortname: speaker.shortName
        }
    }

    async getListShort(){
        const data = await this.getData()
        return data.map(speaker => ({
            name: speaker.name,
            shortname: speaker.shortName,
            title: speaker.title
        }))
    }

    async getList(){
        const data = await this.getData()
        return data.map(speaker => ({
            name: speaker.name,
            shortname: speaker.shortName,
            title: speaker.title,
            summary: speaker.summary
        }))
    }

    async getData(){
        const data = await readFile(this.dataFile, "utf8")
        if(!data) return []
        return JSON.parse(data)
    }
}

module.exports = SpeakerService