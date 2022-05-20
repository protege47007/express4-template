require("dot-env").config()
const path = require("path")

module.exports = {
    development: {
        siteName: "Art Meetups! [Development]",
        data: {
            speaker: path.join(__dirname, "../data/speaker.json"),
            feedback:  path.join(__dirname, "../data/feedback.json"),
            avatars:  path.join(__dirname, "../data/avatars")
        },
        database: {
            dsn: process.env.DEVELOPMENT_DB_DSN
        }
    },
    production: {
        siteName: "Art Meetups!",
        data: {
            speaker: path.join(__dirname, "../data/speaker.json"),
            feedback:  path.join(__dirname, "../data/feedback.json"),
            avatars:  path.join(__dirname, "../data/avatars")
        },
        database: {
            dsn: process.env.PRODUCTION_DB_DSN
        }
    },
    test: {
        siteName: "Art Meetups! [Test]",
        data: {
            speaker: path.join(__dirname, "../data/speaker.json"),
            feedback:  path.join(__dirname, "../data/feedback.json"),
            avatars:  path.join(__dirname, "../data/avatars")
        },
        database: {
            dsn: process.env.TEST_DB_DSN
        }
    }
}