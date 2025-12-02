const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const WorkoutTemplate = require('../models/WorkoutTemplate');

const seedData = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        // Clear existing data
        await User.deleteMany({});
        await Workout.deleteMany({});
        await Exercise.deleteMany({});
        await WorkoutTemplate.deleteMany({});
        console.log('Cleared existing data...');

        // Create Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            name: 'Admin User',
            email: 'admin@fitfusion.com',
            password: adminPassword,
            role: 'admin',
            height: 180,
            weight: 75,
            goalWeight: 70
        });
        await admin.save();
        console.log('✅ Admin user created: admin@fitfusion.com / admin123');

        // Create Client Users
        const clientPassword = await bcrypt.hash('client123', 10);
        const client1 = new User({
            name: 'John Doe',
            email: 'client@fitfusion.com',
            password: clientPassword,
            role: 'client',
            height: 175,
            weight: 80,
            goalWeight: 75,
            bodyType: 'mesomorph',
            fitnessGoals: ['weight_loss', 'muscle_gain'],
            activityLevel: 'moderately_active',
            bio: 'Fitness enthusiast working towards a healthier lifestyle.'
        });
        await client1.save();
        console.log('✅ Client created: client@fitfusion.com / client123');

        const client2 = new User({
            name: 'Sarah Wilson',
            email: 'sarah@fitfusion.com',
            password: clientPassword,
            role: 'client',
            height: 165,
            weight: 60,
            goalWeight: 58,
            bodyType: 'ectomorph',
            fitnessGoals: ['muscle_gain'],
            activityLevel: 'very_active'
        });
        await client2.save();
        console.log('✅ Client created: sarah@fitfusion.com / client123');

        // Create Trainers
        const trainerPassword = await bcrypt.hash('trainer123', 10);
        
        const trainer1 = new User({
            name: 'Mike Johnson',
            email: 'trainer@fitfusion.com',
            password: trainerPassword,
            role: 'trainer',
            bio: 'Certified personal trainer with 10+ years of experience specializing in weightlifting and strength training.',
            trainerInfo: {
                specialization: ['weightlifting', 'strength_training', 'bodybuilding'],
                certifications: ['NASM Certified Personal Trainer', 'ISSA Strength & Conditioning'],
                experience: 10,
                hourlyRate: 75,
                availability: 'Mon-Fri: 6am-8pm, Sat: 8am-2pm',
                location: 'Los Angeles, CA',
                socialMedia: {
                    instagram: '@mikefitness',
                    website: 'www.mikejohnsonfitness.com'
                }
            },
            phone: '+1 (555) 123-4567',
            isProfilePublic: true,
            showContactInfo: true
        });
        await trainer1.save();
        console.log('✅ Trainer created: trainer@fitfusion.com / trainer123');

        const trainer2 = new User({
            name: 'Emily Chen',
            email: 'emily@fitfusion.com',
            password: trainerPassword,
            role: 'trainer',
            bio: 'Nutrition and cardio specialist helping clients achieve their weight loss goals.',
            trainerInfo: {
                specialization: ['cardio', 'weight_loss', 'nutrition'],
                certifications: ['ACE Certified Personal Trainer', 'Nutrition Specialist'],
                experience: 7,
                hourlyRate: 65,
                availability: 'Mon-Sun: 5am-9pm',
                location: 'New York, NY',
                socialMedia: {
                    instagram: '@emilyfitness',
                    youtube: 'Emily Fitness Channel'
                }
            },
            phone: '+1 (555) 987-6543',
            isProfilePublic: true,
            showContactInfo: true
        });
        await trainer2.save();
        console.log('✅ Trainer created: emily@fitfusion.com / trainer123');

        // Create Workout Templates
        const templates = [
            {
                name: 'Push Day - Chest, Shoulders, Triceps',
                description: 'Classic push day focusing on upper body pushing movements',
                category: 'push',
                difficulty: 'intermediate',
                duration: 60,
                daysPerWeek: 3,
                exercises: [
                    { name: 'Bench Press', sets: 4, reps: 8, weight: 0, restTime: 180, notes: 'Focus on form' },
                    { name: 'Overhead Press', sets: 4, reps: 8, weight: 0, restTime: 120 },
                    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 0, restTime: 120 },
                    { name: 'Lateral Raises', sets: 3, reps: 12, weight: 0, restTime: 60 },
                    { name: 'Tricep Dips', sets: 3, reps: 12, weight: 0, restTime: 90 },
                    { name: 'Tricep Pushdowns', sets: 3, reps: 15, weight: 0, restTime: 60 }
                ],
                isPublic: true
            },
            {
                name: 'Pull Day - Back, Biceps',
                description: 'Target back and biceps for a complete pull workout',
                category: 'pull',
                difficulty: 'intermediate',
                duration: 60,
                daysPerWeek: 3,
                exercises: [
                    { name: 'Deadlifts', sets: 4, reps: 5, weight: 0, restTime: 240, notes: 'Heavy compound movement' },
                    { name: 'Pull-ups', sets: 4, reps: 8, weight: 0, restTime: 120 },
                    { name: 'Barbell Rows', sets: 4, reps: 10, weight: 0, restTime: 120 },
                    { name: 'Lat Pulldowns', sets: 3, reps: 12, weight: 0, restTime: 90 },
                    { name: 'Barbell Curls', sets: 3, reps: 10, weight: 0, restTime: 90 },
                    { name: 'Hammer Curls', sets: 3, reps: 12, weight: 0, restTime: 60 }
                ],
                isPublic: true
            },
            {
                name: 'Leg Day - Quads, Hamstrings, Glutes',
                description: 'Complete lower body workout',
                category: 'legs',
                difficulty: 'intermediate',
                duration: 75,
                daysPerWeek: 2,
                exercises: [
                    { name: 'Barbell Squats', sets: 5, reps: 8, weight: 0, restTime: 180, notes: 'Focus on depth' },
                    { name: 'Romanian Deadlifts', sets: 4, reps: 10, weight: 0, restTime: 120 },
                    { name: 'Leg Press', sets: 4, reps: 12, weight: 0, restTime: 120 },
                    { name: 'Leg Curls', sets: 3, reps: 12, weight: 0, restTime: 90 },
                    { name: 'Lunges', sets: 3, reps: 12, weight: 0, restTime: 90 },
                    { name: 'Calf Raises', sets: 4, reps: 20, weight: 0, restTime: 60 }
                ],
                isPublic: true
            },
            {
                name: 'Full Body Beginner',
                description: 'Perfect starter workout for beginners',
                category: 'full_body',
                difficulty: 'beginner',
                duration: 45,
                daysPerWeek: 3,
                exercises: [
                    { name: 'Bodyweight Squats', sets: 3, reps: 15, weight: 0, restTime: 60 },
                    { name: 'Push-ups', sets: 3, reps: 10, weight: 0, restTime: 60 },
                    { name: 'Plank', sets: 3, reps: 30, weight: 0, restTime: 60, notes: 'Hold for 30 seconds' },
                    { name: 'Walking Lunges', sets: 2, reps: 12, weight: 0, restTime: 60 },
                    { name: 'Dumbbell Rows', sets: 3, reps: 12, weight: 0, restTime: 60 }
                ],
                isPublic: true
            },
            {
                name: 'Upper/Lower Split',
                description: '4-day split: Upper Body A & B, Lower Body A & B',
                category: 'upper',
                difficulty: 'advanced',
                duration: 70,
                daysPerWeek: 4,
                exercises: [
                    { name: 'Bench Press', sets: 4, reps: 6, weight: 0, restTime: 180 },
                    { name: 'Pull-ups', sets: 4, reps: 8, weight: 0, restTime: 120 },
                    { name: 'Overhead Press', sets: 4, reps: 8, weight: 0, restTime: 120 },
                    { name: 'Barbell Rows', sets: 4, reps: 8, weight: 0, restTime: 120 },
                    { name: 'Close Grip Bench', sets: 3, reps: 10, weight: 0, restTime: 90 },
                    { name: 'Barbell Curls', sets: 3, reps: 10, weight: 0, restTime: 90 }
                ],
                isPublic: true
            }
        ];

        const savedTemplates = await WorkoutTemplate.insertMany(templates);
        console.log(`✅ Created ${savedTemplates.length} workout templates...`);

        // Sample workouts
        const workouts = [
            {
                user: client1._id,
                title: 'Morning Cardio Blast',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                duration: 45,
                notes: 'Great energy today! Felt strong throughout the session.'
            },
            {
                user: client1._id,
                title: 'Push Day Workout',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                duration: 60,
                notes: 'Hit new PR on bench press!'
            }
        ];

        const savedWorkouts = await Workout.insertMany(workouts);
        console.log(`✅ Created ${savedWorkouts.length} sample workouts...`);

        console.log('\n🎉 Enhanced seeding completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin:  admin@fitfusion.com / admin123');
        console.log('   Client: client@fitfusion.com / client123');
        console.log('   Client: sarah@fitfusion.com / client123');
        console.log('   Trainer: trainer@fitfusion.com / trainer123');
        console.log('   Trainer: emily@fitfusion.com / trainer123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

