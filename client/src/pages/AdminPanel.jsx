import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [editingUser, setEditingUser] = useState(null);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });
    const [workoutForm, setWorkoutForm] = useState({ userId: '', title: '', duration: '', notes: '' });
    const [exerciseForm, setExerciseForm] = useState({ workoutId: '', name: '', sets: '', reps: '', weight: '' });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchAllData();
    }, [user, navigate]);

    const fetchAllData = async () => {
        showLoader('Loading admin data...');
        try {
            const [usersRes, workoutsRes, exercisesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/workouts'),
                api.get('/admin/exercises')
            ]);
            setUsers(usersRes.data);
            setWorkouts(workoutsRes.data);
            setExercises(exercisesRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        } finally {
            hideLoader();
        }
    };

    
    const handleCreateUser = async (e) => {
        e.preventDefault();
        showLoader('Creating user...');
        try {
            await api.post('/admin/users', userForm);
            setUserForm({ name: '', email: '', role: 'user' });
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleUpdateUser = async (userId) => {
        showLoader('Updating user...');
        try {
            await api.put(`/admin/users/${userId}`, userForm);
            setEditingUser(null);
            setUserForm({ name: '', email: '', role: 'user' });
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        showLoader('Deleting user...');
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    
    const handleCreateWorkout = async (e) => {
        e.preventDefault();
        showLoader('Creating workout...');
        try {
            await api.post('/admin/workouts', workoutForm);
            setWorkoutForm({ title: '', duration: '', notes: '' });
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleUpdateWorkout = async (workoutId) => {
        showLoader('Updating workout...');
        try {
            await api.put(`/admin/workouts/${workoutId}`, workoutForm);
            setEditingWorkout(null);
            setWorkoutForm({ userId: '', title: '', duration: '', notes: '' });
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleDeleteWorkout = async (workoutId) => {
        if (!window.confirm('Are you sure you want to delete this workout?')) return;
        showLoader('Deleting workout...');
        try {
            await api.delete(`/admin/workouts/${workoutId}`);
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    
    const handleCreateExercise = async (e) => {
        e.preventDefault();
        showLoader('Creating exercise...');
        try {
            await api.post('/admin/exercises', { workoutId: exerciseForm.workoutId, ...exerciseForm });
            setExerciseForm({ workoutId: '', name: '', sets: '', reps: '', weight: '' });
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleUpdateExercise = async (exerciseId) => {
        showLoader('Updating exercise...');
        try {
            await api.put(`/admin/exercises/${exerciseId}`, exerciseForm);
            setEditingExercise(null);
            setExerciseForm({ name: '', sets: '', reps: '', weight: '' });
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    const handleDeleteExercise = async (exerciseId) => {
        if (!window.confirm('Are you sure you want to delete this exercise?')) return;
        showLoader('Deleting exercise...');
        try {
            await api.delete(`/admin/exercises/${exerciseId}`);
            fetchAllData();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    Admin Panel
                </h2>
                <p className="text-text-muted">Manage users, workouts, and exercises across the platform</p>
            </motion.div>

            {}
            <div className="flex gap-4 mb-8 border-b border-glass-border">
                {['users', 'workouts', 'exercises'].map((tab) => (
                    <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-4 font-semibold capitalize transition-colors ${
                            activeTab === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-text-muted hover:text-text'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tab}
                    </motion.button>
                ))}
            </div>

            {}
            {activeTab === 'users' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {users.map((userItem, index) => (
                                <motion.div
                                    key={userItem._id}
                                    className="glass-card p-6 flex justify-between items-center"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{userItem.name}</h3>
                                        <p className="text-text-muted">{userItem.email}</p>
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                            userItem.role === 'admin' 
                                                ? 'bg-primary/20 text-primary' 
                                                : 'bg-accent/20 text-accent'
                                        }`}>
                                            {userItem.role}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={() => {
                                                setEditingUser(userItem._id);
                                                setUserForm({ name: userItem.name, email: userItem.email, role: userItem.role });
                                            }}
                                            className="btn btn-outline text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDeleteUser(userItem._id)}
                                            className="btn bg-red-500/10 text-red-400 border border-red-500/50 text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="lg:col-span-1">
                        <motion.div
                            className="glass-card p-6 sticky top-24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-accent">
                                {editingUser ? 'Edit User' : 'Create User'}
                            </h3>
                            <form onSubmit={editingUser ? (e) => { e.preventDefault(); handleUpdateUser(editingUser); } : handleCreateUser} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    required
                                />
                                <select
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <motion.button
                                    type="submit"
                                    className="w-full btn btn-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {editingUser ? 'Update' : 'Create'}
                                </motion.button>
                                {editingUser && (
                                    <motion.button
                                        type="button"
                                        onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', role: 'user' }); }}
                                        className="w-full btn btn-outline"
                                    >
                                        Cancel
                                    </motion.button>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {}
            {activeTab === 'workouts' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {workouts.map((workout, index) => (
                                <motion.div
                                    key={workout._id}
                                    className="glass-card p-6"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">{workout.title}</h3>
                                            <p className="text-text-muted text-sm">
                                                {new Date(workout.date).toLocaleDateString()} • {workout.duration} mins
                                            </p>
                                            <p className="text-text-muted mt-2">{workout.notes}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <motion.button
                                                onClick={() => {
                                                    setEditingWorkout(workout._id);
                                                    setWorkoutForm({ title: workout.title, duration: workout.duration, notes: workout.notes });
                                                }}
                                                className="btn btn-outline text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDeleteWorkout(workout._id)}
                                                className="btn bg-red-500/10 text-red-400 border border-red-500/50 text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="lg:col-span-1">
                        <motion.div
                            className="glass-card p-6 sticky top-24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-accent">
                                {editingWorkout ? 'Edit Workout' : 'Create Workout'}
                            </h3>
                            <form onSubmit={editingWorkout ? (e) => { e.preventDefault(); handleUpdateWorkout(editingWorkout); } : handleCreateWorkout} className="space-y-4">
                                {!editingWorkout && (
                                    <select
                                        value={workoutForm.userId}
                                        onChange={(e) => setWorkoutForm({ ...workoutForm, userId: e.target.value })}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        required
                                    >
                                        <option value="">Select User</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                )}
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={workoutForm.title}
                                    onChange={(e) => setWorkoutForm({ ...workoutForm, title: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Duration (minutes)"
                                    value={workoutForm.duration}
                                    onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                />
                                <textarea
                                    placeholder="Notes"
                                    value={workoutForm.notes}
                                    onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 min-h-[100px]"
                                />
                                <motion.button
                                    type="submit"
                                    className="w-full btn btn-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {editingWorkout ? 'Update' : 'Create'}
                                </motion.button>
                                {editingWorkout && (
                                    <motion.button
                                        type="button"
                                        onClick={() => { setEditingWorkout(null); setWorkoutForm({ userId: '', title: '', duration: '', notes: '' }); }}
                                        className="w-full btn btn-outline"
                                    >
                                        Cancel
                                    </motion.button>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {}
            {activeTab === 'exercises' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {exercises.map((exercise, index) => (
                                <motion.div
                                    key={exercise._id}
                                    className="glass-card p-6 flex justify-between items-center"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{exercise.name}</h3>
                                        <p className="text-text-muted">
                                            {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={() => {
                                                setEditingExercise(exercise._id);
                                                setExerciseForm({ name: exercise.name, sets: exercise.sets, reps: exercise.reps, weight: exercise.weight });
                                            }}
                                            className="btn btn-outline text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDeleteExercise(exercise._id)}
                                            className="btn bg-red-500/10 text-red-400 border border-red-500/50 text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Delete
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="lg:col-span-1">
                        <motion.div
                            className="glass-card p-6 sticky top-24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-accent">
                                {editingExercise ? 'Edit Exercise' : 'Create Exercise'}
                            </h3>
                            <form onSubmit={editingExercise ? (e) => { e.preventDefault(); handleUpdateExercise(editingExercise); } : handleCreateExercise} className="space-y-4">
                                {!editingExercise && (
                                    <select
                                        value={exerciseForm.workoutId}
                                        onChange={(e) => setExerciseForm({ ...exerciseForm, workoutId: e.target.value })}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        required
                                    >
                                        <option value="">Select Workout</option>
                                        {workouts.map((w) => (
                                            <option key={w._id} value={w._id}>{w.title} ({w.user?.name || 'Unknown'})</option>
                                        ))}
                                    </select>
                                )}
                                <input
                                    type="text"
                                    placeholder="Exercise Name"
                                    value={exerciseForm.name}
                                    onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    required
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Sets"
                                        value={exerciseForm.sets}
                                        onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Reps"
                                        value={exerciseForm.reps}
                                        onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={exerciseForm.weight}
                                        onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    className="w-full btn btn-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {editingExercise ? 'Update' : 'Create'}
                                </motion.button>
                                {editingExercise && (
                                    <motion.button
                                        type="button"
                                        onClick={() => { setEditingExercise(null); setExerciseForm({ workoutId: '', name: '', sets: '', reps: '', weight: '' }); }}
                                        className="w-full btn btn-outline"
                                    >
                                        Cancel
                                    </motion.button>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminPanel;

