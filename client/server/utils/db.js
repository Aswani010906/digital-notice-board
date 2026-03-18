const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Error: ${error.message}`);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n⚠️  POSSIBLE CAUSES:');
            console.log('1. IP Address Not Whitelisted: Go to MongoDB Atlas -> Network Access -> Add IP Address (Allow from anywhere: 0.0.0.0/0).');
            console.log('2. Network Firewall: Your current Wi-Fi (School/Work) might be blocking port 27017. Try a mobile hotspot.');
            console.log('3. Paused Cluster: Go to MongoDB Atlas and ensure your cluster is "Active" and not "Paused".\n');
        } else {
            console.log('\n⚠️  Please check your MONGO_URI in the .env file.\n');
        }
    }
};

module.exports = connectDB;
