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

/*Find specific first name, last name, email and address of a male or a female student 
whose first name starts with D and last name begins with C or R*/
  try {
    const db = client.db("driveSchool");
    let collection = db.collection("students");
    let pipeline = [
      {
        '$addFields': {
          'startsFirstName': {
              '$substr': [
                '$firstName', 0, 1
              ]
          },
          'startslastName': {
              '$substr': [
                '$lastName', 0, 1
              ]
          },
        }
      },
      {
        '$group':{
          '_id': '$firstName',
          'startsFirstName': {'$first': '$startsFirstName'},
          'startslastName': {'$first': '$startslastName'}
        }
      },
      {
        '$match': {
          '$or': [
            {'startsFirstName': {
              '$eq': 'C'
            }},
            {'startslastName': {
              '$eq': 'D'
            }}
          ]
          
        }
      },
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
