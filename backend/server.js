const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const Job = require("./models/Job");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ========================================
// GET ALL JOBS
// ========================================

app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
});

// ========================================
// GET ONE JOB
// ========================================

app.get("/api/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);
    } catch (error) {
        console.error("Error fetching job:", error);

        res.status(500).json({
            message: "Failed to fetch job"
        });
    }
});

// ========================================
// ADD JOB
// ========================================

app.post("/api/jobs", async (req, res) => {
    try {
        const job = await Job.create(req.body);

        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);

        res.status(400).json({
            message: "Failed to create job",
            error: error.message
        });
    }
});

// ========================================
// UPDATE JOB
// ========================================

app.put("/api/jobs/:id", async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(updatedJob);
    } catch (error) {
        console.error("Error updating job:", error);

        res.status(400).json({
            message: "Failed to update job",
            error: error.message
        });
    }
});

// ========================================
// DELETE JOB
// ========================================

app.delete("/api/jobs/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully",
            job: deletedJob
        });
    } catch (error) {
        console.error("Error deleting job:", error);

        res.status(400).json({
            message: "Failed to delete job",
            error: error.message
        });
    }
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});