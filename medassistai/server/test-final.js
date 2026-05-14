const { MongoClient, ServerApiVersion } = require('mongodb');

// Your actual credentials - already filled in!
const uri = "mongodb+srv://medassist_user:Dyfadhili2021@medassistai.pclmi44.mongodb.net/medassist?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        console.log('🔌 Attempting to connect...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas!');
        
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Ping successful!");
        
        const dbs = await client.db().admin().listDatabases();
        console.log("\n📊 Available databases:");
        dbs.databases.forEach(db => console.log(`   - ${db.name}`));
        
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        
        if (error.message.includes('bad auth')) {
            console.log('\n🔧 Authentication failed. Let\'s try:');
            console.log('   1. Double-check username is exactly "medassist_user"');
            console.log('   2. Check if password has special characters that need encoding');
            console.log('   3. Verify in Atlas → Database Access that user exists');
        }
    } finally {
        await client.close();
    }
}

run();
