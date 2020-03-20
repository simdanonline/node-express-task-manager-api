const mongoose = require('mongoose')

const url = process.env.MONGO_DB_URL

mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify: false
}).then(res=> console.log(''))





