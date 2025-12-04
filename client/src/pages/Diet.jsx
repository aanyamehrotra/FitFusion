import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const Diet = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const [meals, setMeals] = useState([]);
    const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    const [dailyStats, setDailyStats] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    const [goal, setGoal] = useState({ calories: 2000, protein: 150, carbs: 250, fats: 65 });
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchMealsForDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        calculateDailyStats();
    }, [meals]);

    const fetchMealsForDate = async (dateStr) => {
        if (!user) return;
        showLoader('Loading diet entries...');
        try {
            const res = await api.get(`/diet?date=${dateStr}`);
            setMeals(res.data || []);
        } catch (err) {
            console.error('Failed to load diet entries:', err);
        } finally {
            hideLoader();
        }
    };

    const calculateDailyStats = () => {
        const stats = meals.reduce((acc, meal) => ({
            calories: acc.calories + (parseInt(meal.calories) || 0),
            protein: acc.protein + (parseInt(meal.protein) || 0),
            carbs: acc.carbs + (parseInt(meal.carbs) || 0),
            fats: acc.fats + (parseInt(meal.fats) || 0)
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        setDailyStats(stats);
    };

    const handleAddMeal = async () => {
        if (!newMeal.name) return;

        try {
            showLoader('Saving meal...');
            const payload = {
                ...newMeal,
                date: selectedDate,
            };
            const res = await api.post('/diet', payload);
            
            setMeals(prev => [...prev, res.data]);
            setNewMeal({ name: '', calories: '', protein: '', carbs: '', fats: '' });
        } catch (err) {
            console.error('Failed to save meal:', err);
        } finally {
            hideLoader();
        }
    };

    const handleDeleteMeal = async (id) => {
        try {
            showLoader('Removing meal...');
            await api.delete(`/diet/${id}`);
            setMeals(meals.filter(meal => meal._id !== id));
        } catch (err) {
            console.error('Failed to delete meal:', err);
        } finally {
            hideLoader();
        }
    };

    const getProgress = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    const commonMeals = [
        { name: 'Grilled Chicken Breast', calories: 231, protein: 43, carbs: 0, fats: 5 },
        { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fats: 2 },
        { name: 'Salmon Fillet', calories: 206, protein: 22, carbs: 0, fats: 12 },
        { name: 'Greek Yogurt (1 cup)', calories: 130, protein: 11, carbs: 9, fats: 5 },
        { name: 'Oatmeal (1 cup)', calories: 154, protein: 6, carbs: 28, fats: 3 },
        { name: 'Broccoli (1 cup)', calories: 55, protein: 3, carbs: 11, fats: 0 }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    Nutrition & Diet
                </h2>
                <p className="text-text-muted">Track your meals, macros, and achieve your nutrition goals</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                            <h3 className="text-2xl font-bold text-primary">Daily Nutrition</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-text-muted">Select date:</span>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-surface/50 border border-glass-border rounded-lg p-2 text-sm"
                                />
                            </div>
                        </div>
                        
                        {}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-text-muted">Calories</span>
                                <span className="font-bold text-primary">
                                    {dailyStats.calories} / {goal.calories} kcal
                                </span>
                            </div>
                            <div className="w-full bg-surface rounded-full h-3">
                                <motion.div
                                    className="bg-primary h-3 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getProgress(dailyStats.calories, goal.calories)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-text-muted text-sm">Protein</span>
                                    <span className="font-bold text-primary text-sm">
                                        {dailyStats.protein}g
                                    </span>
                                </div>
                                <div className="w-full bg-surface rounded-full h-2">
                                    <motion.div
                                        className="bg-secondary h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getProgress(dailyStats.protein, goal.protein)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <p className="text-text-muted text-xs mt-1">Goal: {goal.protein}g</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-text-muted text-sm">Carbs</span>
                                    <span className="font-bold text-primary text-sm">
                                        {dailyStats.carbs}g
                                    </span>
                                </div>
                                <div className="w-full bg-surface rounded-full h-2">
                                    <motion.div
                                        className="bg-accent h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getProgress(dailyStats.carbs, goal.carbs)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <p className="text-text-muted text-xs mt-1">Goal: {goal.carbs}g</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-text-muted text-sm">Fats</span>
                                    <span className="font-bold text-primary text-sm">
                                        {dailyStats.fats}g
                                    </span>
                                </div>
                                <div className="w-full bg-surface rounded-full h-2">
                                    <motion.div
                                        className="bg-yellow-500 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getProgress(dailyStats.fats, goal.fats)}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <p className="text-text-muted text-xs mt-1">Goal: {goal.fats}g</p>
                            </div>
                        </div>
                    </motion.div>

                    {}
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-primary">Log Meal</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Meal name"
                                value={newMeal.name}
                                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                                className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                <input
                                    type="number"
                                    placeholder="Calories"
                                    value={newMeal.calories}
                                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                                    className="bg-surface/50 border border-glass-border rounded-lg p-3"
                                />
                                <input
                                    type="number"
                                    placeholder="Protein (g)"
                                    value={newMeal.protein}
                                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                                    className="bg-surface/50 border border-glass-border rounded-lg p-3"
                                />
                                <input
                                    type="number"
                                    placeholder="Carbs (g)"
                                    value={newMeal.carbs}
                                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                                    className="bg-surface/50 border border-glass-border rounded-lg p-3"
                                />
                                <input
                                    type="number"
                                    placeholder="Fats (g)"
                                    value={newMeal.fats}
                                    onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                                    className="bg-surface/50 border border-glass-border rounded-lg p-3"
                                />
                            </div>
                            <motion.button
                                onClick={handleAddMeal}
                                className="w-full btn btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Add Meal
                            </motion.button>
                        </div>
                    </motion.div>

                    {}
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-primary">
                            Meals on {selectedDate}
                        </h3>
                        {meals.length > 0 ? (
                            <div className="space-y-3">
                                {meals.map((meal) => (
                                        <motion.div
                                            key={meal._id}
                                            className="glass-card p-4 flex justify-between items-center"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <div>
                                                <h4 className="font-bold text-primary">{meal.name}</h4>
                                                <p className="text-text-muted text-sm">
                                                    {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMeal(meal._id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                ×
                                            </button>
                                        </motion.div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-text-muted text-center py-4">
                                No meals logged for this date
                            </p>
                        )}
                    </motion.div>
                </div>

                {}
                <div className="space-y-6">
                    {}
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-accent">Daily Goals</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Calories</label>
                                <input
                                    type="number"
                                    value={goal.calories}
                                    onChange={(e) => setGoal({ ...goal, calories: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Protein (g)</label>
                                <input
                                    type="number"
                                    value={goal.protein}
                                    onChange={(e) => setGoal({ ...goal, protein: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Carbs (g)</label>
                                <input
                                    type="number"
                                    value={goal.carbs}
                                    onChange={(e) => setGoal({ ...goal, carbs: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Fats (g)</label>
                                <input
                                    type="number"
                                    value={goal.fats}
                                    onChange={(e) => setGoal({ ...goal, fats: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-2"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {}
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-accent">Quick Add</h3>
                        <div className="space-y-2">
                            {commonMeals.map((meal, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setNewMeal(meal)}
                                    className="w-full text-left glass-card p-3 hover:border-primary transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <p className="font-bold text-sm text-primary">{meal.name}</p>
                                    <p className="text-xs text-text-muted">
                                        {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Diet;


