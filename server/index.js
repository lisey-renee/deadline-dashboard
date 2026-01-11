const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
const mongoURI = "mongodb+srv://lisey04_db:Lisey2026@deadlineproject.tlydyso.mongodb.net/deadlineDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("--- SUCCESS: CONNECTED TO MONGODB ATLAS ---"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// 2. DATA BLUEPRINT (Schema)
const assignmentSchema = new mongoose.Schema({
  title: String,
  course: String,
  dueDate: String,
  estimatedHours: Number,
  priority: String,
  completed: { type: Boolean, default: false }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

// 3. ROUTES

// GET: Fetch all assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const allAssignments = await Assignment.find();
    res.json(allAssignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Save a new assignment
app.post('/api/assignments', async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    const savedItem = await newAssignment.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove an assignment
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted from MongoDB" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update an assignment (The Checkmark Logic)
app.put('/api/assignments/:id', async (req, res) => {
  try {
    // findByIdAndUpdate takes the ID, the new data, and {new: true} to return the updated object
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    console.log("Assignment updated in MongoDB!");
    res.json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`--- SERVER IS LIVE ON PORT ${PORT} ---`);
});