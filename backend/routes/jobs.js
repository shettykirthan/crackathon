const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// Create a new job
router.post("/", async (req, res) => {
  try {
    const { title, description, location, salary, skills } = req.body;
    const job = new Job({
      title,
      description,
      location,
      salary,
      skills: skills.split(",").map(s => s.trim()), // convert string → array
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
