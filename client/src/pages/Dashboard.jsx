import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const [workouts, setWorkouts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-date');
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/workouts?page=${page}&limit=5&search=${search}&sort=${sort}`);
            setWorkouts(res.data.workouts);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, [page, search, sort]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            showLoader('Deleting workout...');
            try {
                await api.delete(`/workouts/${id}`);
                await fetchWorkouts();
            } catch (err) {
                console.error(err);
            } finally {
                hideLoader();
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">My Workouts</h2>
                <Link to="/workouts/new">
                    <motion.button
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        + Add Workout
                    </motion.button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search workouts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-surface/50 border border-glass-border rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-surface/50 border border-glass-border rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all md:w-48"
                >
                    <option value="-date">Newest First</option>
                    <option value="date">Oldest First</option>
                    <option value="duration">Duration (Asc)</option>
                    <option value="-duration">Duration (Desc)</option>
                </select>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {workouts.map((workout, index) => (
                        <motion.div
                            key={workout._id}
                            className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
                        >
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-1">{workout.title}</h3>
                                <p className="text-text-muted text-sm">
                                    {new Date(workout.date).toLocaleDateString()} • <span className="text-secondary font-semibold">{workout.duration} mins</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link to={`/workouts/${workout._id}`}>
                                    <motion.button
                                        className="btn btn-outline text-sm py-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        View
                                    </motion.button>
                                </Link>
                                <Link to={`/workouts/edit/${workout._id}`}>
                                    <motion.button
                                        className="btn btn-outline text-sm py-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Edit
                                    </motion.button>
                                </Link>
                                <motion.button
                                    onClick={() => handleDelete(workout._id)}
                                    className="btn bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 text-sm py-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && workouts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && workouts.length === 0 && (
                    <motion.div
                        className="text-center py-12 text-text-muted glass-card p-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="text-6xl mb-4">💪</div>
                        <p className="text-xl">No workouts found. Start your journey by adding one!</p>
                        <Link to="/workouts/new">
                            <motion.button
                                className="btn btn-primary mt-6"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Create Your First Workout
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-4 items-center">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    <span className="text-text-muted">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
