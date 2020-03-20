const express= require('express')
const router = new express.Router()
const User = require('../models/User')
const auth = require('../middlewares/AuthRoutes')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../mail/account')


router.post('/users', async(req, res) => {
    //  console.log(req.body)
     // const { name, email, password, age } = req.body
      const user = new User(req.body)
  
      try { 
          await user.save()
          sendWelcomeEmail(user.email, user.name)
          const token = await user.generateAuthToken()
          res.status(201).send({user, token})
      } catch (error) {
          //console.log(error)
          res.status(400).send(error)
      }
      
  
      // user.save()
      // .then(() =>res.status(201).send(user))
      // .catch(err=>{
      //     res.status(400).send(err)
      //     })
      //res.send(user)
  })
  
  router.post('/login', async(req, res) => {
      try {
          const user = await User.findByCredentials(req.body.email, req.body.password)
          const token = await user.generateAuthToken()
        //  res.send({user: user.getPublicProfile(), token})
        res.send({user, token})
      } catch (e) {
          res.status(404).send(e)
      }
  })

  router.get('/users', async(req, res) => {
        
          try {
              const users = await User.find({})
              res.send(users)
          } catch (error) {
              res.status(500).send(error)
          }
      //     User.find({})
      // .then((users)=>{
      //     res.send(users)
      // }).catch((err)=> res.status(500).send(err))
  })

  router.get('/users/me', auth, async(req, res) => {
      res.send(req.user)
  })

  router.post('/users/logout', auth, async(req, res) => {
      try {
          req.user.tokens = req.user.tokens.filter((token) => {
              return token.token !== req.token
          })
          await req.user.save()
          res.send()
      } catch (e) {
          res.status(500).send()
      }
  })

  router.post('/users/logoutall', auth, async(req, res) => {
      try {
          req.user.tokens = []
          await req.user.save()
          res.send()
      } catch (e) {
          res.status(500).send()
      }
  })
  
//   router.get('/user/:id', async(req, res) => {
//       console.log(req.params.id)
//       const _id = req.params.id
//       try {
//           const user = await User.findById(_id)
//           if(!user){
//               return res.status(404).send()
//           }
//           res.send(user)
//       } catch (error) {
//           res.status(500).send(error)
//       }
//       User.findById(_id).then((user)=>{
//           if(!user){
//               return res.status(404).send()
//           }
//           res.send(user)
//       })
//       .catch((err)=>res.status(500).send())
//   })
  
  router.patch('/user/me', auth, async(req, res) => {
      const updates = Object.keys(req.body)
      const allowed = [ 'name', 'email', 'password', 'age' ]
      const isValidOperation = updates.every((update) => allowed.includes(update))
      if(!isValidOperation){
          return res.status(400).send({ error: "Invalid updates" })
      }
      try {
          const user = req.user
          updates.forEach((update) => user[ update ] = req.body[update])
          await user.save()
          res.send(user)
      } catch (error) {
          res.status(400).send(error)
      }
  })
  
  router.delete('/user/delete', auth, async(req, res) => {
      try {
          //const user = await User.findByIdAndDelete(req.user._id)
        //   if(!user){
        //       return res.status(404).send()
        //   }
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
          res.send(req.user)
      } catch (error) {
          res.status(500).send()
      }
  })

  const upload = multer({
  //  dest: 'avatar',
    limits:{
        fileSize: 1 * 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Invalid file format'))
        }
        cb(undefined, true)
    }
})

router.post('/profilepic', auth, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/profilepic/delete', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router