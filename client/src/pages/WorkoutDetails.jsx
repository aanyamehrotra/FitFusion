import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const WorkoutDetails = () => {
    const { id } = useParams();
    const [workout, setWorkout] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [exerciseForm, setExerciseForm] = useState({ name: '', sets: '', reps: '', weight: '' });
    const [editingExercise, setEditingExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showLoader, hideLoader } = useLoader();

    const fetchData = async () => {
        setLoading(true);
        try {
            const workoutRes = await api.get(`/workouts/${id}`);
            setWorkout(workoutRes.data);
            const exercisesRes = await api.get(`/exercises/${id}`);
            setExercises(exercisesRes.data);
        } catch (err) {
            console.error('Failed to load workout details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const onChange = e => setExerciseForm({ ...exerciseForm, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        showLoader(editingExercise ? 'Updating exercise...' : 'Creating exercise...');
        try {
            if (editingExercise) {
                await api.put(`/exercises/${editingExercise}`, exerciseForm);
                setEditingExercise(null);
            } else {
                await api.post('/exercises', { ...exerciseForm, workoutId: id });
            }
            setExerciseForm({ name: '', sets: '', reps: '', weight: '' });
            await fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleEdit = (exercise) => {
        setEditingExercise(exercise._id);
        setExerciseForm({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight
        });
    };

    const handleDelete = async (exerciseId) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            showLoader('Deleting exercise...');
            try {
                await api.delete(`/exercises/${exerciseId}`);
                await fetchData();
            } catch (err) {
                console.error(err);
            } finally {
                hideLoader();
            }
        }
    };

    if (loading || !workout) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading workout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                className="glass-card p-8 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{workout.title}</h2>
                        <p className="text-text-muted mb-4">
                            {new Date(workout.date).toLocaleDateString()} • <span className="text-secondary font-semibold">{workout.duration} mins</span>
                        </p>
                        <p className="text-lg leading-relaxed">{workout.notes}</p>
                    </div>
                    <Link to={`/workouts/edit/${id}`}>
                        <motion.button
                            className="btn btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Edit Details
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold mb-6 text-primary">Exercises</h3>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {exercises.map((ex, index) => (
                                <motion.div
                                    key={ex._id}
                                    className="glass-card p-6 flex justify-between items-center group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ borderColor: 'var(--primary)' }}
                                >
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">{ex.name}</h4>
                                        <p className="text-text-muted">
                                            <span className="text-primary font-mono text-lg">{ex.sets}</span> sets × <span className="text-primary font-mono text-lg">{ex.reps}</span> reps @ <span className="text-secondary font-mono text-lg">{ex.weight}kg</span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(ex)} className="btn btn-outline text-sm py-1 px-3">Edit</button>
                                        <button onClick={() => handleDelete(ex._id)} className="btn bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 text-sm py-1 px-3">Delete</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {exercises.length === 0 && (
                            <div className="text-text-muted italic">No exercises added yet.</div>
                        )}
                    </div>
                </div>

                <div>
                    <motion.div
                        className="glass-card p-6 sticky top-24"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-accent">{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h3>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Exercise Name"
                                    value={exerciseForm.name}
                                    onChange={onChange}
                                    required
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    type="number"
                                    name="sets"
                                    placeholder="Sets"
                                    value={exerciseForm.sets}
                                    onChange={onChange}
                                    required
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                <input
                                    type="number"
                                    name="reps"
                                    placeholder="Reps"
                                    value={exerciseForm.reps}
                                    onChange={onChange}
                                    required
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                                <input
                                    type="number"
                                    name="weight"
                                    placeholder="kg"
                                    value={exerciseForm.weight}
                                    onChange={onChange}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full btn btn-primary py-3 font-bold"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {editingExercise ? 'Update Exercise' : 'Add Exercise'}
                            </motion.button>

                            {editingExercise && (
                                <motion.button
                                    type="button"
                                    onClick={() => { setEditingExercise(null); setExerciseForm({ name: '', sets: '', reps: '', weight: '' }); }}
                                    className="w-full btn btn-outline py-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutDetails;
