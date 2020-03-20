const jwt = require('jsonwebtoken')
const User = require('../models/User')

const AuthRoute  = async(req, res, next) =>{

   

    try {
        const token  = req.header('Authorization').replace('Bearer ', '')
        const isValid = jwt.verify(token, process.env.JWT)
        
        const user = await User.findOne({_id: isValid._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: "You're unauthorized"})
    }
    
}

module.exports = AuthRoute