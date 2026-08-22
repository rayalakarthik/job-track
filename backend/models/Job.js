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
            trim: true,
            default: ""
        },

        jobUrl: {
            type: String,
            trim: true,
            default: ""
        },

        salary: {
            type: Number,
            default: null
        },

        applicationDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: [
                "Applied",
                "Interview",
                "Assessment",
                "Rejected",
                "Offer",
                "Accepted"
            ]
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;