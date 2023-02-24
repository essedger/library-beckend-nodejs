const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./src/authRouter')
const PORT = process.env.PORT || 5000
const USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${USERNAME}:${DB_PASSWORD}@cluster0.b6pb9.mongodb.net/auth_roles?retryWrites=true&w=majority`)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

