const userModel = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
 
 async function registerController(req, res)  {
    const { username, email, password, bio, profile } = req.body;

    const isUserExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserExist) {
        return res.status(409).json({
            message: "User already exist " +
                (isUserExist.email === email
                    ? "Email already exists"
                    : "Username already exists")
        })
    }

    const hash = await bcryptjs.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profile,
    })

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "Register Successful",
        user: {
            _id:user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profile: user.profile
        }
    })
}
 
 async function loginController (req, res) {
    const { email, username, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            {
                email: email
            }, {
                username: username
            }
        ]
    }).select("+password")

    if (!user) {
        return res.status(404).json({
            message: "user is not exist"
        })
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "password is incorrect"
        })
    }

    const token = jwt.sign({
        id: user._id
    },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    )

    res.cookie("token", token)

    res.status(201).json(
        {
            message: "login successfull",
            user: {
                _id:user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profile: user.profile
            }
        }
    )
}

async function getMeController(req, res) {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile,
      },
    });

  } catch (err) {
    console.log("getMe Error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
}
module.exports = {registerController , loginController, getMeController}