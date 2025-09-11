import Goal from '../models/Goal.js';

export const createGoal = async (req, res) => {
  const { title, description, difficulty } = req.body;
  try {
    const goal = new Goal({
      title,
      description,
      difficulty,
      userId: req.user.id,
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, completedAt: req.body.status === 'completed' ? new Date() : null },
      { new: true }
    );
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    res.json({ msg: 'Goal deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
