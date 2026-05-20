const express = require('express');
const cookieParser = require('cookie-parser')

const cors = require('cors');


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173",
}));

const authRouter = require('./routes/auth.route')
const postRouter = require('./routes/post.routes')
const userRouter = require('./routes/user.route')
const commentRouter = require('./routes/comment.routes')
const messageRouter = require("./routes/message.routes");



app.use("/api/messages", messageRouter);

app.use('/api/auth',authRouter)
app.use('/api/posts',postRouter)
app.use('/api/users',userRouter)
app.use("/api/comments", commentRouter);


module.exports = app 