const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const Job = require("./models/Job");

const app = express();
connectDB();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

let jobs = [];


// GET ALL JOBS
app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
});


// ADD JOB
app.post("/api/jobs", async (req, res) => {
    try {
        const job = await Job.create(req.body);

        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);

        res.status(500).json({
            message: "Failed to create job"
        });
    }
});

// UPDATE JOB
app.put("/api/jobs/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = jobs.findIndex(job => job.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    jobs[index] = {
        id,
        ...req.body
    };

    res.json(jobs[index]);
});


// DELETE JOB
app.delete("/api/jobs/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = jobs.findIndex(job => job.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    const deletedJob = jobs.splice(index, 1);

    res.json(deletedJob[0]);
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});