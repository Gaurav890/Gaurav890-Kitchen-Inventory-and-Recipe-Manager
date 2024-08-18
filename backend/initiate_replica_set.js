const { MongoClient } = require('mongodb');

async function initiateReplicaSet() {
  const uri = 'mongodb://localhost:27017/?directConnection=true';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const admin = client.db('admin').admin();

    const config = {
      _id: "myReplSet",
      members: [
        { _id: 0, host: "localhost:27017" },
        { _id: 1, host: "localhost:27018" },
        { _id: 2, host: "localhost:27019" }
      ]
    };

    console.log('Initiating replica set...');
    const result = await admin.command({ replSetInitiate: config });
    console.log('Replica set initiated:', result);
  } catch (error) {
    console.error('Error initiating replica set:', error);
  } finally {
    await client.close();
  }
}

initiateReplicaSet();