const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        jobUrl: {
            type: String,
            trim: true
        },

        salary: {
            type: Number
        },

        applicationDate: {
            type: Date
        },

        status: {
            type: String,
            required: true,
            enum: [
                "Applied",
                "Interview",
                "Offer",
                "Rejected"
            ]
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;