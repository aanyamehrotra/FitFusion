import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [role, setRole] = useState('client');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration Failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <motion.div
                className="glass-card p-8 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Join FitFusion</h2>

                {error && (
                    <motion.div
                        className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-center"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {error}
                    </motion.div>
                )}

                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${role === 'client' ? 'border-primary bg-primary/10' : 'border-glass-border hover:border-primary/50'}`}
                    >
                        <h3 className={`font-bold text-lg mb-1 ${role === 'client' ? 'text-primary' : 'text-text'}`}>Trainee</h3>
                        <p className="text-xs text-text-muted">I want to find a trainer</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('trainer')}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${role === 'trainer' ? 'border-accent bg-accent/10' : 'border-glass-border hover:border-accent/50'}`}
                    >
                        <h3 className={`font-bold text-lg mb-1 ${role === 'trainer' ? 'text-accent' : 'text-text'}`}>Trainer</h3>
                        <p className="text-xs text-text-muted">I want to train clients</p>
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full btn btn-primary py-3 text-lg font-bold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Create Account
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-text-muted">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
