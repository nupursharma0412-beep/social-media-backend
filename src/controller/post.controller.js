const postModel = require('../models/post.model')
const { ImageKit, toFile } = require('@imagekit/nodejs')
const jwt = require('jsonwebtoken')
const likeModel = require('../models/like.model')


const imagekit = new ImageKit({
    privateKey: process.env.IMAGE_PRIVATE_KEY

})
async function createPostController(req, res) {


    const file = await imagekit.files.upload({
        file: await toFile(req.file.buffer, 'file'),
        fileName: "Test",
        folder:"social-media"
    })


    const post = await postModel.create({
        caption: req.body.caption,
        img: file.url,
        user: req.user.id
    })
    res.status(201).json({
        message: "post created successfully",
        post
    })
}


async function getPostController(req,res){
   
    const userId = req.user.id;

    const posts = await postModel.find({
        user:userId
    })
    res.status(200).json({
        message:"post fetch successfully",
        posts
    })
}


async function getPostdetails(req,res){
  

    const userId = req.user.id;
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post Not found"
        })
    }
    const isValidUser = post.user.toString() === userId

    if(!isValidUser){
        return res.status(403).json({
            message:"forrbidden Content"
        })
    }
    
    return res.status(200).json({
        message:"post fetch successfully",
        post
    })
}

async function likePostController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await likeModel.findOne({
      user: userId,
      post: postId,
    });

    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);

      return res.status(200).json({
        message: "Unliked",
        liked: false,
      });
    }

    await likeModel.create({
      post: postId,
      user: userId,
    });

    res.status(200).json({
      message: "Liked",
      liked: true,
    });

  } catch (err) {
    console.log("Like Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function getFeedController(req, res) {
  try {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const posts = await postModel
      .find()
      .populate("user")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const userLikes = await likeModel.find({ user: userId });

    const likedPostIds = userLikes.map((like) =>
      like.post.toString()
    );

    const likeCounts = await likeModel.aggregate([
      {
        $group: {
          _id: "$post",
          count: { $sum: 1 },
        },
      },
    ]);

    const likeMap = {};
    likeCounts.forEach((item) => {
      likeMap[item._id.toString()] = item.count;
    });

    const updatedPosts = posts.map((post) => ({
      ...post,
      isLike: likedPostIds.includes(post._id.toString()),
      likeCount: likeMap[post._id.toString()] || 0,
    }));

    res.status(200).json({
      post: updatedPosts,
      hasMore: posts.length === limit,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = {
    createPostController,
    getPostController,
    getPostdetails,
    likePostController,
    getFeedController
}