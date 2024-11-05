const app = require('./app')
require('dotenv').config()

app.listen(process.env.PORT, () => {
    console.log(`Server running at : http://${process.env.HOST}:${process.env.PORT}`)
})