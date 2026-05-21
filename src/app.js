const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "https://social-media-frontend-gules-five.vercel.app",
    credentials: true,
  })
);

const authRouter = require("./routes/auth.route");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.route");
const commentRouter = require("./routes/comment.routes");
const messageRouter = require("./routes/message.routes");

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;