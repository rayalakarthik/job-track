const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

const jobs = [
    {
        id: 1,
        company: "Google",
        role: "Software Engineer",
        status: "Applied"
    },
    {
        id: 2,
        company: "Microsoft",
        role: "Data Analyst",
        status: "Interview"
    }
];

app.get("/api/jobs", (req, res) => {
    res.json(jobs);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});