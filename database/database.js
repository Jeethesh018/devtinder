const { default: mongoose } = require("mongoose")

const database = mongoose.connect("mongodb+srv://jeethesh000:NI3MigXeFHCkjT2f@cluster0.3clyc.mongodb.net/devTinder")

module.exports = {database}