const router = require('express').Router();
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const cron = require('node-cron');


const client = new MongoClient(process.env.DB_URL, {'useNewUrlParser': true, 'useUnifiedTopology': true});



router.get('/list', (req, res)=>{
    client.connect((err)=>{
        if(err){
            console.error(err);
            res.json({
                success: false,
                msg: "couldn't connect to db"
            });
        }else{
            console.log("connected to db");
            
            let db = client.db(process.env.DB_NAME);
            let col = db.collection('jobs');
            col.find({}).toArray()
            .then((data)=>{             
                res.json({
                    success: true,
                    'data': data
                });
                client.close();    
            }).catch((err)=>{
                console.error(err);
                res.json({
                    success: false,
                    msg: "error while fetching data"
                });
                client.close();
            });
        }
    });
});



router.put('/add', (req, res)=>{
    client.connect((err)=>{
        if(err){
            console.error(err);
            res.json({
                success: false,
                msg: "couldn't connect to db"
            });
        }else{
            console.log("connected to db");
            
            let db = client.db(process.env.DB_NAME);
            let col = db.collection('jobs');
            col.insertOne({title: req.body.title, description: req.body.desc})
            .then((data)=>{
                //console.log(typeof(data));
                res.json({
                    success: true,
                    msg: "Job created"
                });
                client.close();    
            }).catch((err)=>{
                console.error(err);
                res.json({
                    success: false,
                    msg: "Error while inserting"
                });
                client.close();
            });
            
        }
        
    });
});

router.post('/complete', (req, res)=>{
    client.connect((err)=>{
        if(err){
            console.error(err);
            res.json({
                success: false,
                msg: "couldn't connect to db"
            });
        }else{
            console.log("connected to db");
            
            let db = client.db(process.env.DB_NAME);
            let col = db.collection('jobs');
            let now = new Date();
            col.updateOne({_id: mongodb.ObjectId(req.body.id)}, {$set: {complete: true, completionTime: now}})
            .then((data)=>{
                //console.log(typeof(data));
                res.json({
                    success: true,
                    msg: "Updated"
                });
                client.close();    
            }).catch((err)=>{
                console.error(err);
                res.json({
                    success: false,
                    msg: "Error while updating"
                });
                client.close();
            });
            
        }
        
    });
});








module.exports = router;