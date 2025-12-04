import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WorkoutTemplateSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const title = location.state?.title || 'Workout';

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div
        className="glass-card p-8 w-full max-w-lg text-center"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/15 border border-green-400/50 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>

        <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Workout Logged
        </h2>

        <p className="text-text-muted mb-6">
          <span className="font-semibold text-text">{title}</span> has been created from your template and saved to your
          workout history.
        </p>

        <p className="text-sm text-text-muted mb-6">
          You can view and edit all your workouts from your dashboard at any time.
        </p>

        <motion.button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary w-full md:w-auto px-8 py-3 font-semibold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Move to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WorkoutTemplateSuccess;


