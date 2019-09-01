const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const cron = require('node-cron');

const {verifyToken} = require('../helper');


const client = new MongoClient(process.env.DB_URL, {'useNewUrlParser': true, 'useUnifiedTopology': true});

let tasks= {};


router.get('/list', verifyToken, (req, res)=>{
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
            let col = db.collection('batches');
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



router.put('/add', verifyToken, (req, res)=>{
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
            let col = db.collection('batches');
            col.insertOne({title: req.body.title, description: req.body.desc, batchID: req.body.batchID, interval: req.body.interval})
            .then((data)=>{
                tasks[req.body.batchID] = cron.schedule('*/'+req.body.interval+' * * * *', ()=>{
                    console.log("task called"+Date.now());
                });
                res.json({
                    success: true,
                    msg: "Batch created"
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

router.delete('/remove', verifyToken,  (req, res)=>{
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
            let col = db.collection('batches');
            let now = new Date();
            col.deleteOne({batchID: req.body.batchID})
            .then((data)=>{
                //console.log(typeof(data));
                tasks[req.body.batchID].destroy();
                res.json({
                    success: true,
                    msg: "Deleted"
                });
                client.close();    
            }).catch((err)=>{
                console.error(err);
                res.json({
                    success: false,
                    msg: "Error while deleting"
                });
                client.close();
            });
            
        }
        
    });
});




module.exports = router;