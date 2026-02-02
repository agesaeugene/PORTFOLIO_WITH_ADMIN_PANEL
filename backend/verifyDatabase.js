import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/userSchema.js';

dotenv.config({ path: './config/config.env' });

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('✅ Connected to database successfully!');
  console.log('Database name:', mongoose.connection.db.databaseName);
  console.log('Connection host:', mongoose.connection.host);
  
  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n📁 Collections in this database:');
  collections.forEach(col => console.log('  -', col.name));
  
  // Count users
  const userCount = await User.countDocuments();
  console.log('\n👥 Total users in User collection:', userCount);
  
  // Find all users
  const users = await User.find({}).select('+password');
  console.log('\n📋 All users:');
  if (users.length === 0) {
    console.log('  No users found!');
  } else {
    users.forEach(user => {
      console.log('\n  User:');
      console.log('    ID:', user._id);
      console.log('    Name:', user.fullName);
      console.log('    Email:', user.email);
      console.log('    Phone:', user.phone);
      console.log('    Password (hashed):', user.password ? user.password.substring(0, 20) + '...' : 'N/A');
    });
  }
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection Error:', err.message);
  process.exit(1);
});

