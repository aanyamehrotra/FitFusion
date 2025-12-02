import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const RegisterTrainer = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        specialization: '',
        experience: '',
        hourlyRate: '',
        location: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await register(formData.name, formData.email, formData.password, 'trainer');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration Failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <motion.div
                className="glass-card p-8 w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Join as Trainer
                </h2>
                <p className="text-center text-text-muted mb-6">Share your expertise and help others reach their goals</p>

                {error && (
                    <motion.div
                        className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-center"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                required
                                className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="Mike Johnson"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                required
                                className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="trainer@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            required
                            minLength={6}
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={onChange}
                                className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="Weightlifting"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Experience (years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={onChange}
                                className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">Hourly Rate ($)</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={formData.hourlyRate}
                                onChange={onChange}
                                className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="75"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={onChange}
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Los Angeles, CA"
                        />
                        <p className="text-xs text-text-muted mt-1">You can add more details later in your profile</p>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full btn btn-primary py-3 text-lg font-bold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Create Trainer Account
                    </motion.button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-text-muted">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                    <p className="text-text-muted text-sm">
                        Looking for a trainer? <Link to="/register/client" className="text-accent hover:underline">Register as Client</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterTrainer;

