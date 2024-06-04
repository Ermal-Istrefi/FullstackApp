const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/User');
const bcrypt = require('bcryptjs')
const verifyToken = require('./verifyToken')
const authRoutes = require('./routes/authRoutes');
const expenseroutes = require('./routes/expenseroutes');
const incomeRoutes = require('./routes/incomeroutes');

require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection URI
const uri = "mongodb+srv://ermalistrefi55:mD4k4cr7HNwgg0cf@mali.m41wote.mongodb.net/?retryWrites=true&w=majority&appName=Mali";
mongoose.connect(uri, {});

// Once MongoDB connection is open, log a success message
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Middleware
app.use(cors());
app.use(express.json());



app.use('/api', authRoutes);

app.use('/api/expenses', expenseroutes);
app.use('/api/incomes', incomeRoutes);



app.get('/api/check-token', verifyToken, (req, res) => {

  res.json(req.user);

})


// Create User model
// const User = mongoose.model('User', UserSchema);

// Define Task schema
const TaskSchema = new mongoose.Schema({
  name: String,
  description: String
});

// Create Task model
const Task = mongoose.model('Task', TaskSchema);

// Routes for User management

// GET all users
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// POST a new user
// app.post('/api/user', async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     const savedUser = await newUser.save();
//     res.json(savedUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// PUT route to update a user
// app.put('/api/user/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updateUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(updateUser);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // DELETE route to delete a user
// app.delete('/api/user/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await User.findByIdAndDelete(id);
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



// 
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST per me postu
app.post('/api/task', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT per update
app.put('/api/task/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updateTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updateTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updateTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.delete('/api/task/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



