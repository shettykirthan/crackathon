// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  resumeId: String,   // Appwrite File ID
  videoId: String,    // Appwrite File ID
  score: { type: Number, default: 0 },
  status: { type: String, default: "Interview in progress" },
});

module.exports = mongoose.model("Application", applicationSchema);
