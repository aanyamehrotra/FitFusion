import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const RegisterClient = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await register(formData.name, formData.email, formData.password, 'client');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration Failed. Please try again.');
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
                <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Join as Client
                </h2>
                <p className="text-center text-text-muted mb-6">Start your fitness journey today</p>

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
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                            value={formData.email}
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
                            value={formData.password}
                            onChange={onChange}
                            required
                            minLength={6}
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
                        Create Client Account
                    </motion.button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-text-muted">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                    <p className="text-text-muted text-sm">
                        Are you a trainer? <Link to="/register/trainer" className="text-accent hover:underline">Register as Trainer</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterClient;

