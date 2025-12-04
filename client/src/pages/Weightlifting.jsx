import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const Weightlifting = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const [workouts, setWorkouts] = useState([]);
    const [prs, setPRs] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeightliftingData();
    }, []);

    const fetchWeightliftingData = async () => {
        setLoading(true);
        showLoader('Loading weightlifting data...');
        try {
            const res = await api.get('/workouts');
            const allWorkouts = res.data.workouts || [];
            
            
            const weightliftingWorkouts = allWorkouts.filter(w => 
                w.title.toLowerCase().includes('weight') ||
                w.title.toLowerCase().includes('strength') ||
                w.title.toLowerCase().includes('lift') ||
                w.title.toLowerCase().includes('push') ||
                w.title.toLowerCase().includes('pull') ||
                w.title.toLowerCase().includes('leg')
            );

            setWorkouts(weightliftingWorkouts);

            
            const allExercises = [];
            for (const workout of weightliftingWorkouts) {
                try {
                    const exRes = await api.get(`/exercises/${workout._id}`);
                    if (exRes.data) {
                        exRes.data.forEach(ex => {
                            if (ex.weight > 0) {
                                allExercises.push({
                                    name: ex.name,
                                    weight: ex.weight,
                                    sets: ex.sets,
                                    reps: ex.reps,
                                    date: workout.date
                                });
                            }
                        });
                    }
                } catch (err) {
                    
                }
            }

            
            const prMap = {};
            allExercises.forEach(ex => {
                if (!prMap[ex.name] || ex.weight > prMap[ex.name].weight) {
                    prMap[ex.name] = ex;
                }
            });
            setPRs(Object.values(prMap));
        } catch (err) {
            console.error('Failed to fetch weightlifting data:', err);
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const popularExercises = [
        { name: 'Bench Press', category: 'Chest', tips: 'Keep your back flat, feet planted, and control the descent.' },
        { name: 'Squat', category: 'Legs', tips: 'Go below parallel, keep your chest up, and drive through your heels.' },
        { name: 'Deadlift', category: 'Back', tips: 'Keep the bar close to your body, maintain a neutral spine.' },
        { name: 'Overhead Press', category: 'Shoulders', tips: 'Engage your core, press straight up, not forward.' },
        { name: 'Barbell Row', category: 'Back', tips: 'Pull to your lower chest, squeeze your back muscles.' },
        { name: 'Barbell Curl', category: 'Arms', tips: 'Keep your elbows stationary, control both the lift and lower.' }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    Weightlifting Hub
                </h2>
                <p className="text-text-muted">Track your lifts, set PRs, and perfect your form</p>
            </motion.div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading...</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-primary">Personal Records</h3>
                            {prs.length > 0 ? (
                                <div className="space-y-3">
                                    {prs.map((pr, index) => (
                                        <motion.div
                                            key={index}
                                            className="glass-card p-4 flex justify-between items-center"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div>
                                                <h4 className="font-bold text-primary">{pr.name}</h4>
                                                <p className="text-text-muted text-sm">
                                                    {pr.sets} sets × {pr.reps} reps
                                                </p>
                                                <p className="text-text-muted text-xs">
                                                    {new Date(pr.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-accent">{pr.weight}kg</p>
                                                <p className="text-text-muted text-xs">PR</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-text-muted">
                                    <p>No personal records yet. Start tracking your lifts!</p>
                                    <Link to="/workouts/new">
                                        <motion.button
                                            className="btn btn-primary mt-4"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Create Workout
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {}
                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-primary">Recent Weightlifting Workouts</h3>
                            {workouts.length > 0 ? (
                                <div className="space-y-3">
                                    {workouts.slice(0, 5).map((workout, index) => (
                                        <Link key={workout._id} to={`/workouts/${workout._id}`}>
                                            <motion.div
                                                className="glass-card p-4"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                            >
                                                <h4 className="font-bold text-primary">{workout.title}</h4>
                                                <p className="text-text-muted text-sm">
                                                    {new Date(workout.date).toLocaleDateString()} • {workout.duration} mins
                                                </p>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-text-muted">
                                    <p>No weightlifting workouts yet.</p>
                                    <Link to="/templates">
                                        <motion.button
                                            className="btn btn-primary mt-4"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Browse Templates
                                        </motion.button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {}
                    <div className="space-y-6">
                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-accent">Popular Exercises</h3>
                            <div className="space-y-3">
                                {popularExercises.map((exercise, index) => (
                                    <motion.div
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => setSelectedExercise(exercise)}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="glass-card p-4">
                                            <h4 className="font-bold text-primary">{exercise.name}</h4>
                                            <p className="text-text-muted text-xs">{exercise.category}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-accent">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link to="/workouts/new">
                                    <motion.button
                                        className="w-full btn btn-primary"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Log New Workout
                                    </motion.button>
                                </Link>
                                <Link to="/templates">
                                    <motion.button
                                        className="w-full btn btn-outline"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Browse Templates
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {}
            {selectedExercise && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedExercise(null)}
                >
                    <motion.div
                        className="glass-card p-8 max-w-md w-full"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-primary">{selectedExercise.name}</h3>
                                <p className="text-text-muted">{selectedExercise.category}</p>
                            </div>
                            <button
                                onClick={() => setSelectedExercise(null)}
                                className="text-text-muted hover:text-text text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-bold mb-2 text-accent">Form Tips</h4>
                            <p className="text-text-muted">{selectedExercise.tips}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Weightlifting;


