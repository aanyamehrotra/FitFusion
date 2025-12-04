import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        {
            icon: '💪',
            title: 'Track Your Progress',
            description: 'Monitor your workouts and see your fitness journey unfold with detailed analytics and insights.'
        },
        {
            icon: '📊',
            title: 'Smart Analytics',
            description: 'Get valuable insights into your training patterns, strength gains, and performance metrics.'
        },
        {
            icon: '🎯',
            title: 'Set Goals',
            description: 'Create personalized workout plans and achieve your fitness goals with structured training.'
        },
        {
            icon: '📱',
            title: 'Always Accessible',
            description: 'Access your workout data anywhere, anytime. Your fitness journey in your pocket.'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '50K+', label: 'Workouts Tracked' },
        { number: '1M+', label: 'Exercises Logged' },
        { number: '99%', label: 'Satisfaction Rate' }
    ];

    return (
        <div className="min-h-screen bg-background text-text overflow-hidden relative">
            {}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 left-0 w-full h-full"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(0, 242, 234, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(112, 0, 255, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(0, 242, 234, 0.15) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full"
                    style={{
                        left: `${mousePosition.x / 10}px`,
                        top: `${mousePosition.y / 10}px`,
                    }}
                    transition={{ type: "spring", stiffness: 50 }}
                />
            </div>

            {}
            <nav className="relative z-50 px-6 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <motion.div
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        FitFusion
                    </motion.div>
                    <motion.div
                        className="flex gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {user ? (
                            <Link to="/dashboard">
                                <motion.button
                                    className="btn btn-primary"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Go to Dashboard
                                </motion.button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <motion.button
                                        className="btn btn-outline"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Login
                                    </motion.button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        className="btn btn-primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get Started
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </div>
            </nav>

            {}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center">
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Elevate Your
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-accent">
                            Fitness Journey
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Track workouts, set goals, and transform your body with the most intuitive fitness platform
                        designed for athletes and fitness enthusiasts.
                    </motion.p>
                    {!user && (
                        <motion.div
                            className="flex gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link to="/register">
                                <motion.button
                                    className="btn btn-primary text-lg px-8 py-4"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Free Trial
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button
                                    className="btn btn-outline text-lg px-8 py-4"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="glass-card p-6 text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
                        >
                            <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                            <div className="text-text-muted">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-text-muted">
                        Powerful features to help you achieve your fitness goals
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="glass-card p-8"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, borderColor: 'var(--primary)', y: -5 }}
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-2xl font-bold mb-3 text-primary">{feature.title}</h3>
                            <p className="text-text-muted">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    className="glass-card p-12 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Ready to Transform Your Fitness?
                    </h2>
                    <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
                        Join thousands of athletes and fitness enthusiasts who are already using FitFusion
                        to reach their goals.
                    </p>
                    {!user && (
                        <Link to="/register">
                            <motion.button
                                className="btn btn-primary text-lg px-10 py-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started Now
                            </motion.button>
                        </Link>
                    )}
                </motion.div>
            </div>

            {}
            <footer className="relative z-10 border-t border-glass-border mt-20">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center text-text-muted">
                    <p>&copy; 2024 FitFusion. Built for fitness enthusiasts worldwide.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

