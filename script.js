const jobForm =
    document.getElementById("job-form");

const successMessage =
    document.getElementById("success-message");


// ==================================================
// ADD JOB
// ==================================================

if (jobForm) {

    jobForm.addEventListener("submit", (event) => {

        event.preventDefault();


        const company =
            document.getElementById("company").value;

        const jobTitle =
            document.getElementById("jobTitle").value;

        const jobLocation =
            document.getElementById("location").value;

        const jobUrl =
            document.getElementById("jobUrl").value;

        const salary =
            document.getElementById("salary").value;

        const applicationDate =
            document.getElementById("applicationDate").value;

        const status =
            document.getElementById("status").value;

        const notes =
            document.getElementById("notes").value;


        // Create job object
        const job = {

            company,

            jobTitle,

            jobLocation,

            jobUrl,

            salary,

            applicationDate,

            status,

            notes

        };


        // Get existing jobs from localStorage
        const jobs =
            JSON.parse(localStorage.getItem("jobs")) || [];


        // Add new job to array
        jobs.push(job);


        // Save updated array to localStorage
        localStorage.setItem(
            "jobs",
            JSON.stringify(jobs)
        );


        // Show success message
        if (successMessage) {

            successMessage.textContent =
                "Job application added successfully!";

        }


        // Clear form
        jobForm.reset();


        // Check the data in console
        console.log("Job saved successfully");

        console.log(job);

        console.log(jobs);

    });

}


// ==================================================
// DISPLAY JOBS
// ==================================================

const jobsContainer =
    document.getElementById("jobs-container");


if (jobsContainer) {

    // Get jobs from localStorage
    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];


    // Check if there are no jobs
    if (jobs.length === 0) {

        jobsContainer.innerHTML =
            "<p>No job applications found.</p>";

    }


    // Loop through every job
    jobs.forEach((job) => {

        // Create an article element
        const jobCard =
            document.createElement("article");


        // Add job information to the article
        jobCard.innerHTML = `

            <h3>${job.company}</h3>

            <p>
                <strong>Job Title:</strong>
                ${job.jobTitle}
            </p>

            <p>
                <strong>Location:</strong>
                ${job.jobLocation}
            </p>

            <p>
                <strong>Status:</strong>
                ${job.status}
            </p>

            <p>
                <strong>Application Date:</strong>
                ${job.applicationDate}
            </p>

            <p>
                <strong>Salary:</strong>
                ${job.salary}
            </p>

            <p>
                <strong>Notes:</strong>
                ${job.notes}
            </p>

            <p>
                <strong>Job URL:</strong>
                <a href="${job.jobUrl}" target="_blank">
                    View Job
                </a>
            </p>

        `;


        // Add the job card to the page
        jobsContainer.appendChild(jobCard);

    });

}