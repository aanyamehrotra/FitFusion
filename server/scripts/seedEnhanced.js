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

        
        await User.deleteMany({});
        await Workout.deleteMany({});
        await Exercise.deleteMany({});
        await WorkoutTemplate.deleteMany({});
        console.log('Cleared existing data...');

        
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

        
        const clientPassword = await bcrypt.hash('client123', 10);
        const client1 = new User({
            name: 'Rahul Verma',
            email: 'rahul.trainee@fitfusion.com',
            password: clientPassword,
            role: 'client',
            height: 175,
            weight: 82,
            goalWeight: 72,
            bodyType: 'mesomorph',
            fitnessGoals: ['weight_loss', 'muscle_gain'],
            activityLevel: 'moderately_active',
            bio: 'Working professional trying to lose fat and build strength.'
        });
        await client1.save();
        console.log('✅ Trainee created: rahul.trainee@fitfusion.com / client123');

        const client2 = new User({
            name: 'Sarah Wilson',
            email: 'sarah.trainee@fitfusion.com',
            password: clientPassword,
            role: 'client',
            height: 165,
            weight: 60,
            goalWeight: 58,
            bodyType: 'ectomorph',
            fitnessGoals: ['muscle_gain'],
            activityLevel: 'very_active',
            bio: 'Runner looking to add strength training to her routine.'
        });
        await client2.save();
        console.log('✅ Trainee created: sarah.trainee@fitfusion.com / client123');

        const client3 = new User({
            name: 'Aanya Mehra',
            email: 'aanya.trainee@fitfusion.com',
            password: clientPassword,
            role: 'client',
            height: 160,
            weight: 68,
            goalWeight: 58,
            bodyType: 'endomorph',
            fitnessGoals: ['weight_loss'],
            activityLevel: 'lightly_active',
            bio: 'Beginner focused on sustainable fat loss and building healthy habits.'
        });
        await client3.save();
        console.log('✅ Trainee created: aanya.trainee@fitfusion.com / client123');

        
        const trainerPassword = await bcrypt.hash('trainer123', 10);
        
        const trainer1 = new User({
            name: 'Arjun Singh',
            email: 'arjun.trainer@fitfusion.com',
            password: trainerPassword,
            role: 'trainer',
            bio: 'Certified strength coach with 10+ years of experience in weightlifting and powerlifting.',
            trainerInfo: {
                specialization: ['weightlifting', 'strength_training', 'powerlifting'],
                certifications: ['NSCA-CSCS', 'ISSA Strength & Conditioning'],
                experience: 10,
                
                hourlyRate: 1500,
                availability: 'Mon–Sat: 6am–9pm IST',
                location: 'Mumbai, India',
                socialMedia: {
                    instagram: '@coach_arjun',
                    website: 'https://www.google.com'
                }
            },
            phone: '+91-90000-11111',
            isProfilePublic: true,
            showContactInfo: true
        });
        await trainer1.save();
        console.log('✅ Trainer created: arjun.trainer@fitfusion.com / trainer123 (₹1500/hr)');

        const trainer2 = new User({
            name: 'Emily Chen',
            email: 'emily.trainer@fitfusion.com',
            password: trainerPassword,
            role: 'trainer',
            bio: 'Nutrition and cardio specialist helping clients achieve sustainable weight loss.',
            trainerInfo: {
                specialization: ['cardio', 'weight_loss', 'nutrition'],
                certifications: ['ACE Certified Personal Trainer', 'Nutrition Specialist'],
                experience: 7,
                
                hourlyRate: 1200,
                availability: 'Mon–Sun: 5am–9pm IST',
                location: 'Bengaluru, India',
                socialMedia: {
                    instagram: '@emilyfitness',
                    youtube: 'Emily Fitness Channel'
                }
            },
            phone: '+91-90000-22222',
            isProfilePublic: true,
            showContactInfo: true
        });
        await trainer2.save();
        console.log('✅ Trainer created: emily.trainer@fitfusion.com / trainer123 (₹1200/hr)');

        const trainer3 = new User({
            name: 'Karan Patel',
            email: 'karan.trainer@fitfusion.com',
            password: trainerPassword,
            role: 'trainer',
            bio: 'Online coach specialising in home workouts and beginner transformations.',
            trainerInfo: {
                specialization: ['home_workouts', 'fat_loss', 'bodyweight_training'],
                certifications: ['Certified Personal Trainer'],
                experience: 5,
                
                hourlyRate: 800,
                availability: 'Mon–Fri: 7am–10pm IST',
                location: 'Delhi, India',
                socialMedia: {
                    instagram: '@karan.fit',
                    youtube: 'Karan Fit'
                }
            },
            phone: '+91-90000-33333',
            isProfilePublic: true,
            showContactInfo: true
        });
        await trainer3.save();
        console.log('✅ Trainer created: karan.trainer@fitfusion.com / trainer123 (₹800/hr)');

        
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
        console.log('   Admin:    admin@fitfusion.com           / admin123');
        console.log('   Trainee:  rahul.trainee@fitfusion.com   / client123');
        console.log('   Trainee:  sarah.trainee@fitfusion.com   / client123');
        console.log('   Trainee:  aanya.trainee@fitfusion.com   / client123');
        console.log('   Trainer:  arjun.trainer@fitfusion.com   / trainer123  (₹1500/hr)');
        console.log('   Trainer:  emily.trainer@fitfusion.com   / trainer123  (₹1200/hr)');
        console.log('   Trainer:  karan.trainer@fitfusion.com   / trainer123  (₹800/hr)');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

