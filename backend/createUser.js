import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/userSchema.js';  // Changed to named import

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to database...');
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: "eugenethebandit@gmail.com" });
  if (existingUser) {
    console.log('User already exists with email: eugenethebandit@gmail.com');
    process.exit(0);
  }
  
  const user = await User.create({
    fullName: "Eugene Agesa",
    email: "eugenethebandit@gmail.com",
    password: "1234abcd",
    phone: "+254741589416",
    aboutMe: "Portfolio admin user",
    portfolioURL: "https://yoursite.com",
    avatar: {
      public_id: "default_avatar",
      url: "https://res.cloudinary.com/default/image/upload/v1/default_avatar.png"
    },
    resume: {
      public_id: "default_resume",
      url: "https://res.cloudinary.com/default/image/upload/v1/default_resume.pdf"
    }
  });
  
  console.log('✅ User created successfully!');
  console.log('Email:', user.email);
  console.log('Password: 1234abcd');
  console.log('\nYou can now login with these credentials.');
  
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
