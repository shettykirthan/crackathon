const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  skills: { type: [String], required: true }, // store skills as array
  status: { type: String, enum: ["Active", "Closed"], default: "Active" },
  postedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
