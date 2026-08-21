const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("JobTrack server is running");
});

app.get("/api/jobs", (req, res) => {
    res.json([
        {
            company: "Google",
            position: "Software Engineer",
            status: "Applied"
        },
        {
            company: "Microsoft",
            position: "Data Analyst",
            status: "Interview"
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});