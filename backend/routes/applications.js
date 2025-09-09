// routes/applications.js
const express = require("express");
const Application = require("../models/Application");
const router = express.Router();

// Create new application
router.post("/", async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.json(newApp);
  } catch (err) {
    res.status(500).json({ error: "Error creating application" });
  }
});

// Update application (score, status, video, etc.)
router.put("/:id", async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: "Error updating application" });
  }
});

module.exports = router;
