
import dotenv from 'dotenv';
import { User } from './models/userSchema.js';

dotenv.config({ path: './config/config.env' });

console.log('Connecting to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('\n✅ Connected to database successfully!');
  console.log('Database name:', mongoose.connection.name);
  console.log('Database host:', mongoose.connection.host);
  
  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n📁 Collections in database:');
  collections.forEach(col => console.log('  -', col.name));
  
  // Find all users
  const users = await User.find({});
  console.log('\n👥 Total users found:', users.length);
  
  if (users.length > 0) {
    console.log('\nUsers in database:');
    users.forEach((user, index) => {
      console.log(`\n  User ${index + 1}:`);
      console.log('    ID:', user._id);
      console.log('    Name:', user.fullName);
      console.log('    Email:', user.email);
      console.log('    Phone:', user.phone);
    });
  } else {
    console.log('\n⚠️  No users found in the database!');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection Error:', err.message);
  process.exit(1);
});
