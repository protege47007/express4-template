const fs = require("fs")
const util = require("util")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

// logic for reading and writing feedback data

class FeedbackService{
    // constructor
    // @param {*} datafile path to json file that contains the feedback data

    constructor(dataFile){
        this.dataFile = dataFile
    }

    // to get all feedback items
    async getList(){
        return (await this.getData)
    }

    async addEntry(name, email, title, message){
        const data = (await this.getData()) || []
        data.unshift({name, email, title, message})
        return writeFile(this.dataFile, JSON.stringify(data))
    }

    // fetches data from the filepath provided in the constructor
    async getData(){
        const data = await readFile(this.dataFile, "utf8")
        if(!data) return[]
        return JSON.parse(data) 
    }
}

module.exports = FeedbackService