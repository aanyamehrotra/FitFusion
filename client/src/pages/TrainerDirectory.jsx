import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const TrainerDirectory = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const [trainers, setTrainers] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        setLoading(true);
        showLoader('Loading trainers...');
        try {
            const res = await api.get('/profile/trainers');
            setTrainers(res.data);
        } catch (err) {
            console.error('Failed to fetch trainers:', err);
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    const filteredTrainers = trainers.filter(trainer => {
        if (!filter) return true;
        const filterLower = filter.toLowerCase();
        return (
            trainer.name.toLowerCase().includes(filterLower) ||
            trainer.trainerInfo?.specialization?.some(spec => spec.toLowerCase().includes(filterLower)) ||
            trainer.trainerInfo?.location?.toLowerCase().includes(filterLower)
        );
    });

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    Find Your Trainer
                </h2>
                <p className="text-text-muted">Connect with certified fitness professionals</p>
            </motion.div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, specialization, or location..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full max-w-md bg-surface/50 border border-glass-border rounded-xl p-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading trainers...</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTrainers.map((trainer, index) => (
                            <motion.div
                                key={trainer._id}
                                className="glass-card p-6 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                                onClick={() => setSelectedTrainer(trainer)}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                                        {trainer.profilePicture ? (
                                            <img 
                                                src={trainer.profilePicture.includes('http') ? trainer.profilePicture : `http://localhost:5000${trainer.profilePicture}`} 
                                                alt={trainer.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xl font-bold">
                                                {trainer.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-primary mb-1">{trainer.name}</h3>
                                        <p className="text-text-muted text-sm">
                                            {trainer.trainerInfo?.experience || 0}+ years experience
                                        </p>
                                    </div>
                                </div>

                                {trainer.bio && (
                                    <p className="text-text-muted text-sm mb-4 line-clamp-2">{trainer.bio}</p>
                                )}

                                {trainer.trainerInfo?.specialization && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {trainer.trainerInfo.specialization.slice(0, 3).map((spec, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div>
                                        {trainer.trainerInfo?.hourlyRate && (
                                            <p className="text-lg font-bold text-primary">
                                                ${trainer.trainerInfo.hourlyRate}<span className="text-sm text-text-muted">/hr</span>
                                            </p>
                                        )}
                                        {trainer.trainerInfo?.location && (
                                            <p className="text-text-muted text-xs">{trainer.trainerInfo.location}</p>
                                        )}
                                    </div>
                                    <motion.button
                                        className="btn btn-outline text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        View Profile
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredTrainers.length === 0 && (
                <div className="text-center py-12 glass-card">
                    <p className="text-text-muted text-xl">No trainers found matching your search.</p>
                </div>
            )}

            {/* Trainer Detail Modal */}
            {selectedTrainer && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedTrainer(null)}
                >
                    <motion.div
                        className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-3xl font-bold text-primary">{selectedTrainer.name}</h3>
                            <button
                                onClick={() => setSelectedTrainer(null)}
                                className="text-text-muted hover:text-text text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            {selectedTrainer.bio && (
                                <div>
                                    <h4 className="text-lg font-bold mb-2 text-accent">About</h4>
                                    <p className="text-text-muted">{selectedTrainer.bio}</p>
                                </div>
                            )}

                            {selectedTrainer.trainerInfo && (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 text-accent">Experience</h4>
                                            <p className="text-text">{selectedTrainer.trainerInfo.experience || 0} years</p>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 text-accent">Rate</h4>
                                            <p className="text-text">${selectedTrainer.trainerInfo.hourlyRate || 'N/A'} per hour</p>
                                        </div>
                                        {selectedTrainer.trainerInfo.location && (
                                            <div>
                                                <h4 className="text-lg font-bold mb-2 text-accent">Location</h4>
                                                <p className="text-text">{selectedTrainer.trainerInfo.location}</p>
                                            </div>
                                        )}
                                        {selectedTrainer.trainerInfo.availability && (
                                            <div>
                                                <h4 className="text-lg font-bold mb-2 text-accent">Availability</h4>
                                                <p className="text-text">{selectedTrainer.trainerInfo.availability}</p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedTrainer.trainerInfo.specialization && selectedTrainer.trainerInfo.specialization.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 text-accent">Specialization</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTrainer.trainerInfo.specialization.map((spec, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-accent/20 text-accent rounded-full">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedTrainer.trainerInfo.certifications && selectedTrainer.trainerInfo.certifications.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 text-accent">Certifications</h4>
                                            <ul className="list-disc list-inside text-text-muted space-y-1">
                                                {selectedTrainer.trainerInfo.certifications.map((cert, idx) => (
                                                    <li key={idx}>{cert}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}

                            {selectedTrainer.showContactInfo && (
                                <div className="pt-6 border-t border-glass-border">
                                    <h4 className="text-lg font-bold mb-4 text-accent">Contact Information</h4>
                                    <div className="space-y-2">
                                        {selectedTrainer.email && (
                                            <p className="text-text">
                                                <span className="text-text-muted">Email:</span> {selectedTrainer.email}
                                            </p>
                                        )}
                                        {selectedTrainer.phone && (
                                            <p className="text-text">
                                                <span className="text-text-muted">Phone:</span> {selectedTrainer.phone}
                                            </p>
                                        )}
                                        {selectedTrainer.trainerInfo?.socialMedia && (
                                            <div className="flex gap-4 mt-4">
                                                {selectedTrainer.trainerInfo.socialMedia.instagram && (
                                                    <a href={`https://instagram.com/${selectedTrainer.trainerInfo.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                                        Instagram
                                                    </a>
                                                )}
                                                {selectedTrainer.trainerInfo.socialMedia.website && (
                                                    <a href={selectedTrainer.trainerInfo.socialMedia.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                                        Website
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default TrainerDirectory;


