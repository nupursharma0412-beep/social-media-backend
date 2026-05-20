const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

const { ImageKit, toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGE_PRIVATE_KEY,
});

async function updateProfileImage(req, res) {
  try {
    const file = await imagekit.files.upload({
      file: await toFile(req.file.buffer, "profile"),
      fileName: "profile",
      folder: "social-media/profile",
    });

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { profile: file.url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated",
      profile: user.profile,
    });

  } catch (err) {
    console.log("Upload Error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
}

async function getUserProfileController(req, res) {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await postModel.find({ user: id });

    const followers = await followModel.countDocuments({
      following: id,
    });

    const following = await followModel.countDocuments({
      follower: id,
    });

    const isFollowing = await followModel.findOne({
      follower: currentUserId,
      following: id,
    });

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile,
      },
      posts,
      followers,
      following,
      isFollowing: !!isFollowing,
    });

  } catch (err) {
    console.log("Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


async function followUserController(req, res) {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userid;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const userExists = await userModel.findById(targetUserId);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFollow = await followModel.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (alreadyFollow) {
      return res.status(400).json({
        message: "Already following",
      });
    }

    const followRecord = await followModel.create({
      follower: currentUserId,
      following: targetUserId,
    });

    res.status(201).json({
      message: "Followed successfully",
      follow: followRecord,
    });

  } catch (err) {
    console.log("Follow Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


async function unfollowUserController(req, res) {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userid;

    const followRecord = await followModel.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (!followRecord) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    await followModel.findByIdAndDelete(followRecord._id);

    res.status(200).json({
      message: "Unfollowed successfully",
    });

  } catch (err) {
    console.log("Unfollow Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateProfileController(req, res) {
  try {
    const { username, bio } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { username, bio },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated",
      user: {
        _id: user._id,
        username: user.username,
        bio: user.bio,
        profile: user.profile,
      },
    });

  } catch (err) {
    console.log("Edit Profile Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
}



async function getChatUsersController(req, res) {
  try {
    const userId = req.user.id;

    const followers = await followModel
      .find({ following: userId })
      .populate("follower", "username profile");

    const following = await followModel
      .find({ follower: userId })
      .populate("following", "username profile");

    const followerUsers = followers.map(f => f.follower).filter(Boolean);
    const followingUsers = following.map(f => f.following).filter(Boolean);

    const users = [...followerUsers, ...followingUsers];

    const uniqueUsers = Array.from(
      new Map(users.map(u => [u._id.toString(), u])).values()
    );

    res.status(200).json({ users: uniqueUsers });

  } catch (err) {
    console.log("Chat Users Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  getUserProfileController,
  followUserController,
  unfollowUserController,
  updateProfileImage,
  updateProfileController,
  getChatUsersController
};