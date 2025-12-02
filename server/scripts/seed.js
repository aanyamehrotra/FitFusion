const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        // Clear existing data (optional - comment out if you want to keep existing data)
        await User.deleteMany({});
        await Workout.deleteMany({});
        await Exercise.deleteMany({});
        console.log('Cleared existing data...');

        // Create Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            name: 'Admin User',
            email: 'admin@fitfusion.com',
            password: adminPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin user created: admin@fitfusion.com / admin123');

        // Create Regular User
        const userPassword = await bcrypt.hash('user123', 10);
        const user = new User({
            name: 'John Doe',
            email: 'user@fitfusion.com',
            password: userPassword,
            role: 'user'
        });
        await user.save();
        console.log('✅ User created: user@fitfusion.com / user123');

        // Create another regular user
        const user2Password = await bcrypt.hash('user123', 10);
        const user2 = new User({
            name: 'Sarah Wilson',
            email: 'sarah@fitfusion.com',
            password: user2Password,
            role: 'user'
        });
        await user2.save();
        console.log('✅ User created: sarah@fitfusion.com / user123');

        // Sample workouts for user
        const workouts = [
            {
                user: user._id,
                title: 'Morning Cardio Blast',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                duration: 45,
                notes: 'Great energy today! Felt strong throughout the session. Increased my pace by 2km/h.'
            },
            {
                user: user._id,
                title: 'Upper Body Strength',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                duration: 60,
                notes: 'Hit new PR on bench press! Feeling pumped for the rest of the week.'
            },
            {
                user: user._id,
                title: 'Leg Day Power',
                date: new Date(),
                duration: 75,
                notes: 'Tough workout but pushed through. Soreness expected tomorrow!'
            },
            {
                user: user._id,
                title: 'Yoga Flow Session',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                duration: 30,
                notes: 'Perfect recovery session. Really helped with flexibility.'
            },
            {
                user: user._id,
                title: 'Full Body Circuit',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                duration: 50,
                notes: 'Completed all 5 rounds! Great conditioning workout.'
            }
        ];

        const savedWorkouts = await Workout.insertMany(workouts);
        console.log(`✅ Created ${savedWorkouts.length} workouts for user...`);

        // Sample exercises for workouts
        const exercises = [
            // Exercises for Morning Cardio Blast
            { workout: savedWorkouts[0]._id, name: 'Running', sets: 1, reps: 1, weight: 0 },
            { workout: savedWorkouts[0]._id, name: 'Jumping Jacks', sets: 3, reps: 30, weight: 0 },
            { workout: savedWorkouts[0]._id, name: 'Burpees', sets: 3, reps: 15, weight: 0 },
            
            // Exercises for Upper Body Strength
            { workout: savedWorkouts[1]._id, name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
            { workout: savedWorkouts[1]._id, name: 'Dumbbell Rows', sets: 4, reps: 10, weight: 35 },
            { workout: savedWorkouts[1]._id, name: 'Shoulder Press', sets: 3, reps: 12, weight: 25 },
            { workout: savedWorkouts[1]._id, name: 'Bicep Curls', sets: 3, reps: 15, weight: 20 },
            { workout: savedWorkouts[1]._id, name: 'Tricep Dips', sets: 3, reps: 12, weight: 0 },
            
            // Exercises for Leg Day Power
            { workout: savedWorkouts[2]._id, name: 'Barbell Squats', sets: 5, reps: 8, weight: 120 },
            { workout: savedWorkouts[2]._id, name: 'Romanian Deadlifts', sets: 4, reps: 10, weight: 100 },
            { workout: savedWorkouts[2]._id, name: 'Leg Press', sets: 4, reps: 12, weight: 180 },
            { workout: savedWorkouts[2]._id, name: 'Lunges', sets: 3, reps: 12, weight: 30 },
            { workout: savedWorkouts[2]._id, name: 'Calf Raises', sets: 4, reps: 20, weight: 50 },
            
            // Exercises for Yoga Flow Session
            { workout: savedWorkouts[3]._id, name: 'Sun Salutations', sets: 1, reps: 10, weight: 0 },
            { workout: savedWorkouts[3]._id, name: 'Warrior Poses', sets: 1, reps: 5, weight: 0 },
            { workout: savedWorkouts[3]._id, name: 'Tree Pose', sets: 1, reps: 3, weight: 0 },
            
            // Exercises for Full Body Circuit
            { workout: savedWorkouts[4]._id, name: 'Push-ups', sets: 3, reps: 20, weight: 0 },
            { workout: savedWorkouts[4]._id, name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
            { workout: savedWorkouts[4]._id, name: 'Squats', sets: 3, reps: 25, weight: 0 },
            { workout: savedWorkouts[4]._id, name: 'Plank', sets: 3, reps: 60, weight: 0 },
            { workout: savedWorkouts[4]._id, name: 'Mountain Climbers', sets: 3, reps: 30, weight: 0 }
        ];

        await Exercise.insertMany(exercises);
        console.log(`✅ Created ${exercises.length} exercises...`);

        // Create workouts for user2
        const workouts2 = [
            {
                user: user2._id,
                title: 'HIIT Training',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                duration: 40,
                notes: 'High intensity interval training session. Feeling energized!'
            },
            {
                user: user2._id,
                title: 'Core Strength',
                date: new Date(),
                duration: 35,
                notes: 'Focused on core stability and strength. Great form today.'
            }
        ];

        const savedWorkouts2 = await Workout.insertMany(workouts2);
        console.log(`✅ Created ${savedWorkouts2.length} workouts for user2...`);

        const exercises2 = [
            { workout: savedWorkouts2[0]._id, name: 'High Knees', sets: 4, reps: 30, weight: 0 },
            { workout: savedWorkouts2[0]._id, name: 'Mountain Climbers', sets: 4, reps: 25, weight: 0 },
            { workout: savedWorkouts2[0]._id, name: 'Jump Squats', sets: 3, reps: 15, weight: 0 },
            
            { workout: savedWorkouts2[1]._id, name: 'Plank Hold', sets: 3, reps: 60, weight: 0 },
            { workout: savedWorkouts2[1]._id, name: 'Russian Twists', sets: 3, reps: 30, weight: 10 },
            { workout: savedWorkouts2[1]._id, name: 'Leg Raises', sets: 3, reps: 15, weight: 0 }
        ];

        await Exercise.insertMany(exercises2);
        console.log(`✅ Created ${exercises2.length} exercises for user2...`);

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin: admin@fitfusion.com / admin123');
        console.log('   User:  user@fitfusion.com / user123');
        console.log('   User2: sarah@fitfusion.com / user123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

