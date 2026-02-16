import Challenge from "../models/Challenge.js";
import Goal from "../models/Goal.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// Helper: Calculate XP for a user between two dates
const calculateXpInRange = async (userId, startDate, endDate) => {
  const goals = await Goal.find({
    userId,
    status: "completed",
    completedAt: { $gte: startDate, $lte: endDate },
  });

  let xp = 0;
  for (const goal of goals) {
    if (goal.difficulty === "easy") xp += 10;
    if (goal.difficulty === "medium") xp += 20;
    if (goal.difficulty === "hard") xp += 30;
  }
  return xp;
};

// Create a new challenge
export const createChallenge = async (req, res) => {
  try {
    const { name, participantIds, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      return res
        .status(400)
        .json({ msg: "Name, start date, and end date are required" });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ msg: "End date must be after start date" });
    }

    // Validate participants are friends
    const allParticipants = [req.user.id, ...(participantIds || [])];
    const uniqueParticipants = [...new Set(allParticipants)];

    if (uniqueParticipants.length > 5) {
      return res.status(400).json({ msg: "Maximum 5 participants allowed" });
    }

    // Verify all participants are friends with the creator
    for (const pid of participantIds || []) {
      const isFriend = await FriendRequest.findOne({
        status: "accepted",
        $or: [
          { from: req.user.id, to: pid },
          { from: pid, to: req.user.id },
        ],
      });
      if (!isFriend) {
        const user = await User.findById(pid);
        return res.status(400).json({
          msg: `${user ? user.username : "User"} is not your friend`,
        });
      }
    }

    const challenge = new Challenge({
      name,
      creator: req.user.id,
      participants: uniqueParticipants,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await challenge.save();
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get all challenges for the current user
export const getChallenges = async (req, res) => {
  try {
    const now = new Date();

    // Auto-complete challenges that have passed their end date
    await Challenge.updateMany(
      { participants: req.user.id, status: "active", endDate: { $lt: now } },
      { status: "completed" },
    );

    const challenges = await Challenge.find({ participants: req.user.id })
      .populate("participants", "username")
      .populate("creator", "username")
      .sort({ createdAt: -1 });

    // Calculate leaderboard for each challenge
    const enriched = await Promise.all(
      challenges.map(async (challenge) => {
        const leaderboard = await Promise.all(
          challenge.participants.map(async (p) => {
            const xp = await calculateXpInRange(
              p._id,
              challenge.startDate,
              challenge.endDate,
            );
            return { userId: p._id, username: p.username, xp };
          }),
        );

        leaderboard.sort((a, b) => b.xp - a.xp);

        return {
          _id: challenge._id,
          name: challenge.name,
          creator: challenge.creator,
          participants: challenge.participants,
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          status: challenge.status,
          createdAt: challenge.createdAt,
          leaderboard,
          winner: leaderboard.length > 0 ? leaderboard[0] : null,
        };
      }),
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get a single challenge with leaderboard
export const getChallenge = async (req, res) => {
  try {
    const now = new Date();
    const challenge = await Challenge.findById(req.params.id)
      .populate("participants", "username")
      .populate("creator", "username");

    if (!challenge) return res.status(404).json({ msg: "Challenge not found" });

    // Auto-complete if past end date
    if (challenge.status === "active" && challenge.endDate < now) {
      challenge.status = "completed";
      await challenge.save();
    }

    const leaderboard = await Promise.all(
      challenge.participants.map(async (p) => {
        const xp = await calculateXpInRange(
          p._id,
          challenge.startDate,
          challenge.endDate,
        );
        return { userId: p._id, username: p.username, xp };
      }),
    );

    leaderboard.sort((a, b) => b.xp - a.xp);

    res.json({
      _id: challenge._id,
      name: challenge.name,
      creator: challenge.creator,
      participants: challenge.participants,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      status: challenge.status,
      createdAt: challenge.createdAt,
      leaderboard,
      winner: leaderboard.length > 0 ? leaderboard[0] : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete a challenge (only creator)
export const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ msg: "Challenge not found" });
    if (challenge.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Only the creator can delete this challenge" });
    }
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ msg: "Challenge deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
