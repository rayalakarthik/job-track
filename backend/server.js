const express = require("express");
const authMiddleware = require("./middleware/authMiddleware");
const path = require("path");
const connectDB = require("./config/db");
const Job = require("./models/Job");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// ========================================
// GET ALL JOBS
// ========================================

app.get("/api/jobs", authMiddleware, async (req, res) => {

    try {

        const jobs = await Job.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

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

app.get("/api/jobs/:id", authMiddleware, async (req, res) => {

    try {

        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id
        });

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

app.post("/api/jobs", authMiddleware, async (req, res) => {

    try {

        const job = await Job.create({
            ...req.body,
            user: req.user._id
        });

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

app.put("/api/jobs/:id", authMiddleware, async (req, res) => {

    try {

        const updatedJob = await Job.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },

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

app.delete("/api/jobs/:id", authMiddleware, async (req, res) => {

    try {

        const deletedJob = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

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