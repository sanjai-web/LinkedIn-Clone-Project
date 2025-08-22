const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const User = require('./models/User');
const Post = require('./models/Post');
const path = require('path');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const Video = require('./models/Video'); 
require('dotenv').config();

const app = express();
const PORT = 3001;


app.use(express.json());
app.use(cors());

const uploadDir = './uploads';
app.use('/uploads', express.static(uploadDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.token = token;
    req.user = user;
    next();
  });
};

app.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) throw new Error('User not found');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

app.post('/posts', verifyToken, upload.single('media'), async (req, res) => {
  const { description } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = new Post({
      description,
      mediaUrl,
      user: req.user.userId,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/posts', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'firstName lastName profileImageUrl');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Example server-side (Node.js with Express)
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort in descending order
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});



app.get('/posts/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate('user', 'firstName lastName email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/posts/:postId', verifyToken, upload.single('media'), async (req, res) => {
  const { postId } = req.params;
  const { description } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let updatedPost = await Post.findById(postId);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    updatedPost.description = description;
    updatedPost.mediaUrl = mediaUrl;
    await updatedPost.save();
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/posts/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log(password);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ firstName, lastName, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/user/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/messages', verifyToken, async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    const newMessage = new Message({
      senderId: req.user.userId,
      receiverId,
      message,
    });
    await newMessage.save();

    const notification = new Notification({
      userId: receiverId,
      senderId: req.user.userId,
      message: 'New message from ' + req.user.userId,
    });
    await notification.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/messages/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.userId, receiverId: userId },
        { senderId: userId, receiverId: req.user.userId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/notifications', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId, isRead: false }).populate('senderId', 'firstName lastName');
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/notifications/:notificationId/read', verifyToken, async (req, res) => {
  const { notificationId } = req.params;

  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/user/profile-image', verifyToken, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
      user.profileImageUrl = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ profileImageUrl: user.profileImageUrl });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// New Endpoint for Updating User Details
app.put('/user/details', verifyToken, async (req, res) => {
  const { degree, branch, experienceYears, workplace, domain, mobileNumber, collegeSchool, graduationDate } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'teacher') {
      user.degree = degree;
      user.branch = branch;
      user.experienceYears = experienceYears;
      user.workplace = workplace;
      user.domain = domain;
      user.mobileNumber = mobileNumber;
    } else if (user.role === 'student') {
      user.collegeSchool = collegeSchool;
      user.degree = degree;
      user.branch = branch;
      user.graduationDate = graduationDate;
      user.mobileNumber = mobileNumber;
    }

    await user.save();
    res.json({ message: 'User details updated successfully', user });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/videos', verifyToken, async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// server.js or appropriate route file
app.get('/videos/:videoId', verifyToken, async (req, res) => {
  const { videoId } = req.params;
  
  try {
    const video = await Video.findById(videoId).populate('user', 'firstName lastName profileImageUrl');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/videos', verifyToken, upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'attachments', maxCount: 5 }
]), async (req, res) => {
  try {
    const { videoTitle, description } = req.body;
    const videoFile = req.files['videoFile'] ? req.files['videoFile'][0] : null;
    const thumbnailFile = req.files['thumbnailFile'] ? req.files['thumbnailFile'][0] : null;
    const attachments = req.files['attachments'] || [];

    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoUrl = `/uploads/${videoFile.filename}`;
    const thumbnailUrl = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null;
    const attachmentUrls = attachments.map(file => `/uploads/${file.filename}`);

    const newVideo = new Video({
      title: videoTitle,
      description,
      videoUrl,
      thumbnailUrl,
      attachments: attachmentUrls,
      user: req.user.userId,
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
