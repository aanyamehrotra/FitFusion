import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';

const WorkoutManager = () => {
    const [formData, setFormData] = useState({ title: '', duration: '', notes: '' });
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            const fetchWorkout = async () => {
                const res = await api.get(`/workouts/${id}`);
                setFormData({
                    title: res.data.title,
                    duration: res.data.duration,
                    notes: res.data.notes
                });
            };
            fetchWorkout();
        }
    }, [id, isEdit]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/workouts/${id}`, formData);
            } else {
                await api.post('/workouts', formData);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
                className="glass-card p-8 w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    {isEdit ? 'Edit Workout' : 'Create New Workout'}
                </h2>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Workout Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            required
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="e.g., Morning Cardio Blast"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={onChange}
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="45"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={onChange}
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px]"
                            placeholder="How did it feel? Any personal records?"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full btn btn-primary py-3 text-lg font-bold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isEdit ? 'Update Workout' : 'Create Workout'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default WorkoutManager;
