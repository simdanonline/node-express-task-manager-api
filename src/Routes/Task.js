const express = require('express')
const Tasks = require('../models/Tasks')
const router = new express.Router()
const auth = require('../middlewares/AuthRoutes')


router.post('/tasks', auth, async (req, res) => {
    //console.log(req.body)
    
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    // task.save()
    // .then(() => res.status(201).send(task))
    // .catch((err)=> res.status(400).send(err))
})


// GET EVERY TASK IN THE DATABASE
// router.get('/tasks', async (req, res) =>{

//     try {
//         const task = await Tasks.find()
//         res.send(task)
//     } catch (error) {
//         res.status(500).send()
//     }
//     // Tasks.find().then(task => {
//     //     res.send(task)
//     // })
//     // .catch(err => res.status(500).send())
// })


// GET ALL TASKS /get?completed=false
//limit & skip
//GET /tasks?limit=1&skip10 shows only one per page
//GET /tasks?sortBy=createdAt_asc/desc

router.get('/tasks/user', auth, async (req, res) =>{
    //console.log(req.query)
    const match = {}
    const sort={}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try {
        //  const task = await Tasks.find({owner: req.user._id})
        //res.send(task)
        // await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
            // match:{
            //     completed: req.query.completed || false
            // }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
    // Tasks.find().then(task => {
    //     res.send(task)
    // })
    // .catch(err => res.status(500).send())
})


router.get('/task/:id', auth, async(req, res) => {
    const _id = req.params.id
   // console.log(_id)
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }


    // Tasks.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // })
    // .catch((e)=> res.status(500).send())
})

router.patch('/task/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowed = [ 'description', 'completed' ]
    const isValidOperation = updates.every((update) => allowed.includes(update))
    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {

        const task = await Tasks.findOne({_id: req.params.id, owner: req.user._id})
        //const task = await Tasks.findById(req.params.id)

       // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[ update ] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})


router.delete('/task/:id', auth, async(req, res) => {
    try {
        //const task = await Tasks.findByIdAndDelete(req.params.id)
        const task = await Tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router