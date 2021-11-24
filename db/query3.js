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

/*Find all locations with the average ratings of coaches in those states, where the duration of the course is 3.5 hours.
 The result is grouped by location with average ratings bigger than 3.8 and the result is ordered by ratings descendly*/

  try {
    const db = client.db("driveSchool");
    let collection = db.collection("courses");
    let pipeline = [
      {
        '$addFields': {
          'duraNum': {
            '$toDouble': {
              '$substrBytes': [
                '$duration', 0, 3
              ]
            }
          }
        }
      },
      {
        '$group':{
          '_id': '$coach.location',
          'avg': {
            '$avg': '$coach.ratings'
          },
          'duraNum': {'$first': '$duraNum'}
        }
      },
      {
        '$match': {
          'duraNum': {'$gte': 3.5}
        }
      },
      {
        '$sort':{
          'avg': -1
        }
      }
    ];
    const cursor = await collection.aggregate(pipeline).toArray();

    await console.log(cursor);
    // return res;
    
  } catch(err){
  	console.log(err);
  }	finally {
    client.close();
  }
}

query();
