const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function checkData() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\nFound ${collections.length} collections:`);

        for (let collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            console.log(`- Collection '${collection.name}': ${count} documents`);

            // If there are documents, show the first one as an example
            if (count > 0) {
                const sample = await mongoose.connection.db.collection(collection.name).findOne();
                console.log(`  Sample data:`, sample);
            }
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

checkData();
