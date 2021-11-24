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

  /*Find all coaches' name whoseratings is more than the average  of those coaches teaching in California. 
Besides, the coach registered on 2019 and their location is California*/

  try {
    const db = client.db("driveSchool");
    let collection = db.collection("coaches");
    let pipeline = [
      {
        '$match': {
          'location': {'$eq': 'CA'},
          // 'registerOn': {
          //   // '$gte': '2021-01-01 00:00:00',
          //   '$gte': new Date(2021,1,1,0,0,0),
          //   '$lte': new Date(2021,12,31,23,59,59)
          // }
        }
      },
      {
        '$group':{
          '_id': null,
          'avg': {
            '$avg': '$ratings'
          }
        }
      }
    ];
    const cursor = await collection.aggregate(pipeline).toArray();
    let pipeline2 = [
      {
        '$match': {
          'location': {'$eq': 'CA'},
          'ratings': {'$gte': cursor[0].avg}
        }
      }
    ];
    const cursor2 = await collection.aggregate(pipeline2).toArray();
    await console.log(cursor2);
    // return res;
    
  } catch(err){
  	console.log(err);
  }	finally {
    client.close();
  }
}

query();
