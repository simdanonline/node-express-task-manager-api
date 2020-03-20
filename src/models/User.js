const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./Tasks')

const url = process.env.MONGO_DB_URL

mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify: false
}).then(res=> console.log('successfully connected to db'))


const userSchema = new mongoose.Schema( {
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    name: {
         type: String,
         required: true,
         trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age must be a positive number")
            }
        },
       
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],
    password: {
        type: String,
        minlength: 6,
        max: 12,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your password cannot include the word password')
            }
        }
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// userSchema.methods.getPublicProfile = function(){
//     const user = this
//     const userObject = user.toObject()
//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
        const user = this
        const userObject = user.toObject()
        delete userObject.password
        delete userObject.tokens
        delete userObject.avatar
        return userObject
}


userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT,)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}



userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Incorrect email/password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Incorrect email/password')
    }
    return user
}





// Hash passwords before saving to db
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


//delete user tasks when user is removed
userSchema.pre('remove', async function(req, res, next) {
    const user = this
    await  Tasks.deleteMany({owner: user._id})
    next();
})

const  User = mongoose.model('User', userSchema)

module.exports = User