import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid credentials. Please try again.');
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
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome Back</h2>

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
                        Login
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-text-muted">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
