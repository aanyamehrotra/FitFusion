const DietEntry = require('../models/DietEntry');


exports.createEntry = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats, date } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Meal name is required' });
    }

    const entryDate = date ? new Date(date) : new Date();

    const entry = new DietEntry({
      user: req.user.id,
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      date: entryDate,
    });

    const saved = await entry.save();
    res.json(saved);
  } catch (err) {
    console.error('Diet create error:', err);
    res.status(500).json({ msg: 'Server error creating diet entry' });
  }
};


exports.getEntries = async (req, res) => {
  try {
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const entries = await DietEntry.find({
      user: req.user.id,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ createdAt: 1 });

    res.json(entries);
  } catch (err) {
    console.error('Diet fetch error:', err);
    res.status(500).json({ msg: 'Server error fetching diet entries' });
  }
};


exports.deleteEntry = async (req, res) => {
  try {
    const entry = await DietEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await entry.deleteOne();
    res.json({ msg: 'Diet entry removed' });
  } catch (err) {
    console.error('Diet delete error:', err);
    res.status(500).json({ msg: 'Server error deleting diet entry' });
  }
};


