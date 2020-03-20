const mongoose = require('mongoose')
const validator = require('validator')


const url = 'mongodb://127.0.0.1:27017/task-manager-api'


mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
}).then(res=> console.log(''))


const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed:{
        default: false,
        type: Boolean
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Tasks = mongoose.model('Tasks', taskSchema)

module.exports = Tasks