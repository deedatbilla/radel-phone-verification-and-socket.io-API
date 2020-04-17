const express = require('express')
const app = express()
const main = require('./src')
const port = process.env.PORT
app.use(express.json())
app.use(main)
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
   
}) 