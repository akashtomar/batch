const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DB_URL, {'useNewUrlParser': true, 'useUnifiedTopology': true});

client.connect((err)=>{
    if(err){
        console.error(err);
        
    }else{
        console.log("connected to db");
        console.log("creating indexes")
        let db = client.db(process.env.DB_NAME);
        let col = db.collection('jobs');

        col.ensureIndex("completionTime", {"expireAfterSeconds": 20}).then((result)=>{
            console.log("inside then");
            console.log(result);
            client.close();
        }).catch((err)=>{
            console.log("err while create index")
            console.log(err);
            client.close();
        });
        
        
        
    }
});