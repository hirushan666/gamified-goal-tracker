import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// Send a friend request by username
export const sendRequest = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ msg: "Username is required" });

    const targetUser = await User.findOne({ username });
    if (!targetUser) return res.status(404).json({ msg: "User not found" });

    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ msg: "You cannot add yourself" });
    }

    // Check if already friends or request exists
    const existing = await FriendRequest.findOne({
      $or: [
        { from: req.user.id, to: targetUser._id },
        { from: targetUser._id, to: req.user.id },
      ],
    });

    if (existing) {
      if (existing.status === "accepted") {
        return res.status(400).json({ msg: "You are already friends" });
      }
      if (existing.status === "pending") {
        return res.status(400).json({ msg: "Friend request already pending" });
      }
      // If rejected, allow re-sending by updating
      existing.status = "pending";
      existing.from = req.user.id;
      existing.to = targetUser._id;
      await existing.save();
      return res.json({ msg: "Friend request sent" });
    }

    const request = new FriendRequest({
      from: req.user.id,
      to: targetUser._id,
    });
    await request.save();
    res.json({ msg: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get pending requests received by the current user
export const getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      to: req.user.id,
      status: "pending",
    })
      .populate("from", "username xp")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Accept a friend request
export const acceptRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.to.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    request.status = "accepted";
    await request.save();
    res.json({ msg: "Friend request accepted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Reject a friend request
export const rejectRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.to.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    request.status = "rejected";
    await request.save();
    res.json({ msg: "Friend request rejected" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get all friends of the current user
export const getFriends = async (req, res) => {
  try {
    const accepted = await FriendRequest.find({
      status: "accepted",
      $or: [{ from: req.user.id }, { to: req.user.id }],
    })
      .populate("from", "username xp streak")
      .populate("to", "username xp streak");

    const friends = accepted.map((req_doc) => {
      const friend =
        req_doc.from._id.toString() === req.user.id ? req_doc.to : req_doc.from;
      return {
        _id: friend._id,
        username: friend.username,
        xp: friend.xp,
        streak: friend.streak,
      };
    });

    res.json(friends);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const result = await FriendRequest.findOneAndDelete({
      status: "accepted",
      $or: [
        { from: req.user.id, to: friendId },
        { from: friendId, to: req.user.id },
      ],
    });
    if (!result) return res.status(404).json({ msg: "Friendship not found" });
    res.json({ msg: "Friend removed" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
