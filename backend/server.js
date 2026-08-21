const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

let jobs = [];


// GET ALL JOBS
app.get("/api/jobs", (req, res) => {
    res.json(jobs);
});


// ADD JOB
app.post("/api/jobs", (req, res) => {
    const job = {
        id: Date.now(),
        ...req.body
    };

    jobs.push(job);

    res.status(201).json(job);
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