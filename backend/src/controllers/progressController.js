import User from '../models/User.js';
import Goal from '../models/Goal.js';

// Calculate XP, streak, and badges
export const getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const goals = await Goal.find({ userId: req.user.id });
    // XP: 10 (easy), 20 (medium), 30 (hard)
    let xp = 0;
    let streak = 0;
    let badges = [];
    let lastCompleted = null;
    let currentStreak = 0;
    const today = new Date();
    const completedGoals = goals.filter(g => g.status === 'completed' && g.completedAt);
    completedGoals.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    for (const goal of completedGoals) {
      if (goal.difficulty === 'easy') xp += 10;
      if (goal.difficulty === 'medium') xp += 20;
      if (goal.difficulty === 'hard') xp += 30;
      // Streak calculation
      const completedDate = new Date(goal.completedAt);
      if (!lastCompleted || (completedDate - lastCompleted === 86400000)) {
        currentStreak++;
      } else if (completedDate - lastCompleted > 86400000) {
        currentStreak = 1;
      }
      lastCompleted = completedDate;
    }
    streak = currentStreak;
    // Badges
    if (xp >= 100) badges.push('100 XP');
    if (streak >= 7) badges.push('7 Day Streak');
    if (completedGoals.length >= 10) badges.push('10 Goals Completed');
    // Update user
    user.xp = xp;
    user.streak = streak;
    user.badges = badges;
    await user.save();
    res.json({ xp, streak, badges });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
