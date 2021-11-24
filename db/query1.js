const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:27017";

async function query() {
  let db;

  const client = await MongoClient.connect(uri, { useNewUrlParser: true})
  	.catch(err => { console.log(err); }); 

  if (!client){
  	return;
  }
  console.log("connected to Mongo Server") ;

  /*Find the amount of coaches who has ratings more than 4.8 and register after July 2021*/
  try {
    const db = client.db("driveSchool");
    let collection = db.collection("courses");
    let query = {
      'coach.ratings': {'$gt': 4.8},
      'coach.registerOn': {'$gte': '2021-07-01 00:00:00'}
    };

    // const cursor = await collection.aggregate(pipeline).toArray();
    const cursor = await collection.find(query).limit(10).toArray();
    await console.log(cursor.length);
    // return res;
    
  } catch(err){
  	console.log(err);
  }	finally {
    client.close();
  }
}

query();
