import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Welcome = ({ onComplete }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onComplete, 1000); 
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                >
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            className="w-32 h-32 mb-8 relative"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <span className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent" />
                            <span className="absolute inset-2 border-4 border-secondary rounded-full border-b-transparent opacity-70" />
                            <span className="absolute inset-4 border-4 border-accent rounded-full border-l-transparent opacity-50" />
                        </motion.div>

                        <motion.h1
                            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            FitFusion
                        </motion.h1>

                        <motion.p
                            className="mt-4 text-text-muted text-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Elevate Your Fitness
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Welcome;
