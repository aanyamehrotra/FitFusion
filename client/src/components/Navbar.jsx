import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <motion.nav
            className="glass sticky top-4 z-40 rounded-2xl mx-4 mt-4 px-6 py-4 grid grid-cols-3 items-center"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="justify-self-start">
                <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
                    <motion.img
                        src={logo}
                        alt="FitFusion Logo"
                        className="w-10 h-10 object-contain"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                    />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        FitFusion
                    </span>
                </Link>
            </div>

            <div className="justify-self-center hidden md:flex items-center gap-8">
                {user && (
                    <>
                        <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors font-medium">
                            Dashboard
                        </Link>
                        <Link to="/templates" className="text-text-muted hover:text-primary transition-colors font-medium">
                            Templates
                        </Link>
                        {user.role === 'client' && (
                            <Link to="/trainers" className="text-text-muted hover:text-primary transition-colors font-medium">
                                Trainers
                            </Link>
                        )}
                        <Link to="/weightlifting" className="text-text-muted hover:text-primary transition-colors font-medium">
                            Weightlifting
                        </Link>
                        <Link to="/diet" className="text-text-muted hover:text-primary transition-colors font-medium">
                            Diet
                        </Link>
                        <Link to="/profile" className="text-text-muted hover:text-primary transition-colors font-medium">
                            Profile
                        </Link>
                    </>
                )}
            </div>

            <div className="justify-self-end flex items-center gap-6">
                {user ? (
                    <>
                        <span className="text-text-muted hidden lg:block">Hello, <span className="text-primary">{user.name}</span></span>
                        {user.role === 'admin' && (
                            <Link to="/admin">
                                <motion.button
                                    className="btn btn-outline text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Admin
                                </motion.button>
                            </Link>
                        )}
                        <motion.button
                            onClick={logout}
                            className="btn btn-outline text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Logout
                        </motion.button>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login">
                            <motion.button
                                className={`btn ${location.pathname === '/login' ? 'btn-primary' : 'text-text hover:text-primary'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Login
                            </motion.button>
                        </Link>
                        <Link to="/register">
                            <motion.button
                                className={`btn ${location.pathname === '/register' ? 'btn-primary' : 'btn-outline'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Register
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
