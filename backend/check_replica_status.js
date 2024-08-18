const { MongoClient } = require('mongodb');

async function checkReplicaStatus() {
  const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=myReplSet';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const admin = client.db('admin').admin();

    const status = await admin.command({ replSetGetStatus: 1 });
    console.log('Replica set status:', JSON.stringify(status, null, 2));
  } catch (error) {
    console.error('Error checking replica status:', error);
  } finally {
    await client.close();
  }
}

checkReplicaStatus();