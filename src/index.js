const express = require('express')
const userRouter = require('../src/Routes/User')
const taskRouter = require('../src/Routes/Task')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
    console.log(`server is listening on port ${port}`)
})