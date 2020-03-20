// CRUD CREATE READ UPDATE DELETE

const mongodb = require('mongodb');

const { ObjectID, MongoClient } = mongodb

const url = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const time  = Date.now()

// const id = new ObjectID()
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database ' + error)
    }


    const db = client.db(databaseName)
    // --CREATE COLLECTION AND INSERT ----//

    // db.collection('Tasks').insertOne({
    //     name: "Simdan",
    //     age: 22
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('error: ' + err)
    //     }
    //     console.log(res.ops)
    // })
    // db.collection("Tasks").insertMany([
    //     {
    //         "name": "Joy",
    //         "Age": 20
    //     }, {
    //         "name": "kola",
    //         "Age": 28
    //     }
    // ], (err, res) => {
    //     if (err) {
    //         return console.log("error")
    //     }
    //     console.log(res.ops)
    // })

    // db.collection('Note').insertMany([
    //     {
    //         "name": "wash",
    //         "description": "I am a good boy",
    //         "completed": false
    //     },
    //     {
    //         "name": "cook",
    //         "description": "I am a good boy",
    //         "completed": true
    //     },
    //     {
    //         "name": "clean",
    //         "description": "I am a good boy",
    //         "completed": "I'm not going"
    //     }
    // ], (err, res) => {
    //     if(err){
    //        return console.log(err)
    //     }
    //     console.log('success: ' + res.ops)
    // })

    // -- READ DATA FROM DATABASE --- //

  //  db.collection("Tasks").find({ age: 22 }).count(( err, res) => console.log(res) )
    // db.collection("Todo").findOne({ _id: new ObjectID("5e70fa6bdb2775369074422b")}, (err, res) => {
    //     if(err){
    //         return console.log(err)
    //     }
    //     console.log(res)
    // })
    // db.collection("Todo").find({ completed: false }).toArray((err, res) => {
    //     if(err){
    //         return console.log(err)
    //     }
    //     console.log(res)
    // })

    //--UPDATE DATA IN THE DATABASE --- //

    // db.collection('Tasks').updateOne({ _id: ObjectID("5e7003a762cc4a2698e398ce")},{
    //     $inc:{
    //         Age: 1
    //     }
    // })
    // .then((result) => {
    //     console.log(result)
    // }).catch((err) => {
    //     console.log(err)
    // })

    // db.collection('Todo').updateMany({completed: false},{
    //     $set:{
    //         completed: true
    //     }
    // }).then((res) => {
    //     console.log(res)
    // })
    // .catch((err) =>{
    //     console.log(err)
    // })


    // -- DELETE DATA IN THE DATABASE -- //

    // db.collection('Tasks'). deleteOne({ _id:ObjectID("5e7003a762cc4a2698e398ce") })
    // .then(res => {
    //     console.log('removed ' + res)
    // })
    // .catch((err) => {
    //     console.log(err)
    // })

    db.collection('Tasks').deleteMany({
        Age: 28
    })
    .then((res) => {
        console.log('success ' + res )
    })
    .catch((err) => {
        console.log(err)
    })
})