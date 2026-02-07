import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useLoader } from '../context/LoaderContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        showLoader('Loading profile...');
        try {
            const res = await api.get('/profile/me');
            setProfile(res.data);
            setFormData(res.data);
            setImagePreview(res.data.profilePicture || '');
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        } finally {
            hideLoader();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;

        showLoader('Uploading image...');
        const formData = new FormData();
        formData.append('profilePicture', imageFile);

        try {
            const res = await api.post('/profile/me/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile({ ...profile, profilePicture: res.data.profilePicture });
            setImageFile(null);
            alert('Profile picture updated successfully!');
        } catch (err) {
            console.error('Failed to upload image:', err);
            alert('Failed to upload image');
        } finally {
            hideLoader();
        }
    };

    const handleSave = async () => {
        showLoader('Saving profile...');
        try {
            const res = await api.put('/profile/me', formData);
            setProfile(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Failed to update profile');
        } finally {
            hideLoader();
        }
    };

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-text-muted">Loading profile...</p>
                </div>
            </div>
        );
    }

    const isTrainer = profile.role === 'trainer';

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                    My Profile
                </h2>
                <p className="text-text-muted">Manage your profile and personal information</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                { }
                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="text-xl font-bold mb-4 text-primary">Profile Picture</h3>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30">
                            {imagePreview ? (
                                <img
                                    src={
                                        imagePreview.startsWith('data:') || imagePreview.startsWith('http')
                                            ? imagePreview
                                            : `${import.meta.env.VITE_BACKEND_URL}${imagePreview}`
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-4xl">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="w-full space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-text-muted"
                                />
                                <motion.button
                                    type="button"
                                    onClick={handleImageUpload}
                                    className="btn btn-outline w-full"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Upload Picture
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-primary">Personal Information</h3>
                            {!isEditing ? (
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-outline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Edit Profile
                                </motion.button>
                            ) : (
                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={handleSave}
                                        className="btn btn-primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Save
                                    </motion.button>
                                    <motion.button
                                        onClick={() => { setIsEditing(false); setFormData(profile); setImageFile(null); setImagePreview(profile.profilePicture || ''); }}
                                        className="btn btn-outline"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    />
                                ) : (
                                    <p className="text-text">{profile.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
                                <p className="text-text-muted">{profile.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Role</label>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${profile.role === 'admin'
                                            ? 'bg-primary/20 text-primary'
                                            : profile.role === 'trainer'
                                                ? 'bg-accent/20 text-accent'
                                                : 'bg-secondary/20 text-secondary'
                                        }`}
                                >
                                    {profile.role}
                                </span>
                            </div>
                            {isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    />
                                </div>
                            )}
                            {!isEditing && profile.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Phone</label>
                                    <p className="text-text">{profile.phone}</p>
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-text-muted mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        )}
                        {!isEditing && profile.bio && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-text-muted mb-2">Bio</label>
                                <p className="text-text">{profile.bio}</p>
                            </div>
                        )}
                    </motion.div>

                    { }
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-primary">Physical Stats</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Height (cm)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    />
                                ) : (
                                    <p className="text-text">{profile.height || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Weight (kg)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    />
                                ) : (
                                    <p className="text-text">{profile.weight || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Goal Weight (kg)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="goalWeight"
                                        value={formData.goalWeight || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    />
                                ) : (
                                    <p className="text-text">{profile.goalWeight || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Body Type</label>
                                {isEditing ? (
                                    <select
                                        name="bodyType"
                                        value={formData.bodyType || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                    >
                                        <option value="">Select</option>
                                        <option value="ectomorph">Ectomorph</option>
                                        <option value="mesomorph">Mesomorph</option>
                                        <option value="endomorph">Endomorph</option>
                                    </select>
                                ) : (
                                    <p className="text-text capitalize">{profile.bodyType || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    { }
                    {isTrainer && profile.trainerInfo && (
                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-accent">Trainer Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Experience (years)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="trainerInfo.experience"
                                            value={formData.trainerInfo?.experience || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                trainerInfo: { ...formData.trainerInfo, experience: e.target.value }
                                            })}
                                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        />
                                    ) : (
                                        <p className="text-text">{profile.trainerInfo.experience || 'Not set'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Hourly Rate ($)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="trainerInfo.hourlyRate"
                                            value={formData.trainerInfo?.hourlyRate || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                trainerInfo: { ...formData.trainerInfo, hourlyRate: e.target.value }
                                            })}
                                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        />
                                    ) : (
                                        <p className="text-text">${profile.trainerInfo.hourlyRate || 'Not set'}</p>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-text-muted mb-2">Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="trainerInfo.location"
                                            value={formData.trainerInfo?.location || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                trainerInfo: { ...formData.trainerInfo, location: e.target.value }
                                            })}
                                            className="w-full bg-surface/50 border border-glass-border rounded-lg p-3"
                                        />
                                    ) : (
                                        <p className="text-text">{profile.trainerInfo.location || 'Not set'}</p>
                                    )}
                                </div>
                                {profile.trainerInfo.specialization && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-muted mb-2">Specialization</label>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.trainerInfo.specialization.map((spec, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;


