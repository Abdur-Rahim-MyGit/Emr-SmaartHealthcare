import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Remove all existing listeners to prevent duplicate listeners
        mongoose.connection.removeAllListeners();

        // Set up connection event listeners
        mongoose.connection.on('connected', () => {
            console.log("Database Connected Successfully");
            console.log(`Connected to: ${process.env.MONGODB_URI.split('@')[1] || process.env.MONGODB_URI}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
            if (err.name === 'MongoNetworkError') {
                console.error('Network error detected. Please check your internet connection and MongoDB server status.');
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        const rawUri = process.env.MONGODB_URI || ''
        const uri = rawUri.trim()

        if (!uri) {
            throw new Error('MONGODB_URI is missing or empty. Create backend/.env and set MONGODB_URI.')
        }
        if (!(uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
            throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://". Current: ' + rawUri)
        }

        const isLocalConnection = uri.includes('127.0.0.1') || uri.includes('localhost');

        console.log(`Attempting to connect to MongoDB ${isLocalConnection ? 'Local' : 'Atlas'}...`);

        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            retryWrites: true,
            ...(isLocalConnection ? {} : {
                ssl: true,
                authSource: 'admin'
            })
        };

        await mongoose.connect(uri, options);
        
    } catch (error) {
        console.error('\nFailed to connect to MongoDB:');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            if (isLocalConnection) {
                console.error('\nLocal MongoDB connection refused. Please check:');
                console.error('1. Is MongoDB installed?');
                console.error('2. Is MongoDB service running?');
                console.error('3. Run these commands as administrator:');
                console.error('   - net stop MongoDB');
                console.error('   - net start MongoDB');
            } else {
                console.error('\nAtlas connection refused. Please check:');
                console.error('1. Your internet connection');
                console.error('2. Firewall/antivirus settings');
                console.error('3. VPN settings (if using)');
            }
        }
        
        throw error; // Re-throw the error to be handled by the server
    }
};

export default connectDB;