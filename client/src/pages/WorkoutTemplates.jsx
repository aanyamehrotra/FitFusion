import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const WorkoutTemplates = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [filter, setFilter] = useState({ category: '', difficulty: '' });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, [filter]);

    const fetchTemplates = async () => {
        setLoading(true);
        showLoader('Loading templates...');
        try {
            const params = new URLSearchParams();
            if (filter.category) params.append('category', filter.category);
            if (filter.difficulty) params.append('difficulty', filter.difficulty);

            const res = await api.get(`/templates?${params.toString()}`);
            setTemplates(res.data);
        } catch (err) {
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const handleUseTemplate = async (templateId) => {
        showLoader('Creating workout from template...');
        try {
            await api.post(`/templates/${templateId}/use`);

            
            const template = templates.find(t => t._id === templateId);
            if (template) {
                const workoutData = {
                    title: template.name,
                    duration: template.duration,
                    notes: `Created from template: ${template.description || ''}`
                };
                const workoutRes = await api.post('/workouts', workoutData);

                
                if (template.exercises && template.exercises.length > 0) {
                    for (const exercise of template.exercises) {
                        await api.post('/exercises', {
                            workoutId: workoutRes.data._id,
                            name: exercise.name,
                            sets: exercise.sets,
                            reps: exercise.reps,
                            weight: exercise.weight || 0
                        });
                    }
                }

                
                navigate('/workouts/template-success', {
                    state: {
                        workoutId: workoutRes.data._id,
                        title: workoutData.title,
                    },
                });
            }
        } catch (err) {
            console.error('Failed to use template:', err);
            
            alert('Failed to create workout from template');
        } finally {
            hideLoader();
        }
    };

    const categories = ['push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'custom'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    Workout Templates
                </h2>
                <p className="text-text-muted">Choose from pre-built workout splits or create your own</p>
            </motion.div>

            <div className="flex flex-wrap gap-4 mb-8">
                <select
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    className="bg-surface/50 border border-glass-border rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                    ))}
                </select>
                <select
                    value={filter.difficulty}
                    onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                    className="bg-surface/50 border border-glass-border rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                    <option value="">All Difficulties</option>
                    {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading templates...</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {Array.isArray(templates) && templates.map((template, index) => (
                            <motion.div
                                key={template._id}
                                className="glass-card p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-primary flex-1">{template.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${template.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                            template.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {template.difficulty}
                                    </span>
                                </div>

                                {template.description && (
                                    <p className="text-text-muted text-sm mb-4 line-clamp-2">{template.description}</p>
                                )}

                                <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <span>⏱️</span> {template.duration} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span>📅</span> {template.daysPerWeek}/week
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs">
                                        {template.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                </div>

                                {template.exercises && (
                                    <div className="mb-4">
                                        <p className="text-text-muted text-sm mb-2">
                                            {template.exercises.length} exercises
                                        </p>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {template.exercises.slice(0, 3).map((ex, idx) => (
                                                <p key={idx} className="text-xs text-text-muted">
                                                    • {ex.name} - {ex.sets}×{ex.reps}
                                                </p>
                                            ))}
                                            {template.exercises.length > 3 && (
                                                <p className="text-xs text-text-muted">
                                                    + {template.exercises.length - 3} more...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={() => setSelectedTemplate(template)}
                                        className="flex-1 btn btn-outline text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Preview
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleUseTemplate(template._id)}
                                        className="flex-1 btn btn-primary text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Use Template
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && templates.length === 0 && (
                <div className="text-center py-12 glass-card">
                    <p className="text-text-muted text-xl">No templates found matching your filters.</p>
                </div>
            )}

            {}
            {selectedTemplate && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedTemplate(null)}
                >
                    <motion.div
                        className="glass-card p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-3xl font-bold text-primary mb-2">{selectedTemplate.name}</h3>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedTemplate.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                            selectedTemplate.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {selectedTemplate.difficulty}
                                    </span>
                                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                                        {selectedTemplate.category}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="text-text-muted hover:text-text text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {selectedTemplate.description && (
                            <p className="text-text-muted mb-6">{selectedTemplate.description}</p>
                        )}

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="glass-card p-4">
                                <p className="text-text-muted text-sm mb-1">Duration</p>
                                <p className="text-xl font-bold text-primary">{selectedTemplate.duration} min</p>
                            </div>
                            <div className="glass-card p-4">
                                <p className="text-text-muted text-sm mb-1">Days/Week</p>
                                <p className="text-xl font-bold text-primary">{selectedTemplate.daysPerWeek}</p>
                            </div>
                            <div className="glass-card p-4">
                                <p className="text-text-muted text-sm mb-1">Exercises</p>
                                <p className="text-xl font-bold text-primary">{selectedTemplate.exercises?.length || 0}</p>
                            </div>
                        </div>

                        {selectedTemplate.exercises && selectedTemplate.exercises.length > 0 && (
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-accent">Exercises</h4>
                                <div className="space-y-3">
                                    {selectedTemplate.exercises.map((ex, idx) => (
                                        <div key={idx} className="glass-card p-4 flex justify-between items-center">
                                            <div>
                                                <h5 className="font-bold text-primary">{ex.name}</h5>
                                                <p className="text-text-muted text-sm">
                                                    {ex.sets} sets × {ex.reps} reps
                                                    {ex.weight > 0 && ` @ ${ex.weight}kg`}
                                                    {ex.restTime && ` • ${ex.restTime}s rest`}
                                                </p>
                                                {ex.notes && (
                                                    <p className="text-text-muted text-xs mt-1 italic">{ex.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex gap-4">
                            <motion.button
                                onClick={() => {
                                    setSelectedTemplate(null);
                                    handleUseTemplate(selectedTemplate._id);
                                }}
                                className="flex-1 btn btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Use This Template
                            </motion.button>
                            <motion.button
                                onClick={() => setSelectedTemplate(null)}
                                className="btn btn-outline"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Close
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default WorkoutTemplates;


