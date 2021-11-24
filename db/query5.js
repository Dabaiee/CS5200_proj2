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

/*Find all coaches names, showing the ratings of the coaches 
and use a boolean to show whether the coach is in NY. 
Besides, the coach should have equals or more than 2 students
and their ratings is more than 4.8*/
  try {
    const db = client.db("driveSchool");
    let collection = db.collection("courses");
    let coaches = db.collection("coaches");

    let pipeline = [
      
      {
        '$addFields': {
          'duraNum': {
            '$toDouble': {
              '$substrBytes': [
                '$duration', 0, 3
              ]
            }
          },
          'name': {
            '$concat': ['$coach.firstName', ' ', '$coach.lastName']
          },
        }
      },
      {
        '$group':{
          '_id': '$coach',
          'name': {'$first': '$name'},
          'totalTeaching': {'$sum': '$duraNum'},
          'rating': {'$first': '$coach.ratings'}
        }
      },
      {
        '$project':{
          'name': 1,
          'rating': 1,
          'totalTeaching': 1,
          '_id': 0
        }
      },
      {
        '$set':{
          'coach.totalTeaching': '$totalTeaching'
        }
      }
    ];
    await collection.aggregate(pipeline);
    const cursor = await db.collection('coaches').find({}).toArray();
    console.log(cursor);
    // return res;
    
  } catch(err){
  	console.log(err);
  }	finally {
    client.close();
  }
}

query();
