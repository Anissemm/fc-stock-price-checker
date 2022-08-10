const { MongoClient, ServerApiVersion } = require('mongodb');
module.exports = async () => {
    try {
        const uri = process.env.DB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
        await client.connect()
        console.log('Connected to DB.')
        return client.db('stockChecker')    
    } catch (error) {
        console.log(error)
    }
}