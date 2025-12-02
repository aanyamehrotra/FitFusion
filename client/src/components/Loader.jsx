import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import LoaderContext from '../context/LoaderContext';

const Loader = () => {
    const { loading, loadingMessage } = useContext(LoaderContext);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <motion.div
                                className="w-20 h-20 border-4 border-primary/30 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute top-2 left-2 w-16 h-16 border-4 border-accent/50 border-r-transparent rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        <motion.p
                            className="text-lg font-semibold text-primary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {loadingMessage}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;

