const WorkoutTemplate = require('../models/WorkoutTemplate');

exports.getTemplates = async (req, res) => {
    try {
        const { category, difficulty } = req.query;
        const query = { isPublic: true };
        
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const templates = await WorkoutTemplate.find(query)
            .populate('createdBy', 'name profilePicture')
            .sort({ timesUsed: -1, createdAt: -1 });

        res.json(templates);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getTemplate = async (req, res) => {
    try {
        const template = await WorkoutTemplate.findById(req.params.id)
            .populate('createdBy', 'name profilePicture');
        
        if (!template) {
            return res.status(404).json({ msg: 'Template not found' });
        }

        res.json(template);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.createTemplate = async (req, res) => {
    try {
        const templateData = {
            ...req.body,
            createdBy: req.user.id
        };
        const template = new WorkoutTemplate(templateData);
        await template.save();
        
        const populated = await WorkoutTemplate.findById(template._id)
            .populate('createdBy', 'name profilePicture');
        
        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.useTemplate = async (req, res) => {
    try {
        const template = await WorkoutTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ msg: 'Template not found' });
        }

        template.timesUsed += 1;
        await template.save();

        res.json({ message: 'Template marked as used', template });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

