// ========================================
// JOBTRACK - JAVASCRIPT
// ========================================


// ========================================
// ADD JOB
// ========================================

const jobForm = document.getElementById("job-form");

if (jobForm) {

    jobForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get values from the form
        const company = document.getElementById("company").value.trim();
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const location = document.getElementById("location").value.trim();
        const jobUrl = document.getElementById("jobUrl").value.trim();
        const salary = document.getElementById("salary").value;
        const applicationDate =
            document.getElementById("applicationDate").value;
        const status = document.getElementById("status").value;
        const notes = document.getElementById("notes").value.trim();

        // Create a job object
        const job = {
            id: Date.now(),
            company: company,
            jobTitle: jobTitle,
            location: location,
            jobUrl: jobUrl,
            salary: salary,
            applicationDate: applicationDate,
            status: status,
            notes: notes
        };

        // Get existing jobs
        const jobs =
            JSON.parse(localStorage.getItem("jobs")) || [];

        // Add new job
        jobs.push(job);

        // Save updated jobs
        localStorage.setItem(
            "jobs",
            JSON.stringify(jobs)
        );

        // Show success message
        alert("Job application added successfully!");

        // Go to jobs page
        window.location.href = "jobs.html";
    });
}


// ========================================
// DISPLAY JOBS
// ========================================

const jobsContainer =
    document.getElementById("jobs-container");

if (jobsContainer) {

    displayJobs();
}


function displayJobs() {

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    jobsContainer.innerHTML = "";

    // No jobs
    if (jobs.length === 0) {

        jobsContainer.innerHTML = `
            <p class="no-jobs">
                No job applications yet.
            </p>
        `;

        return;
    }

    // Display every job
    jobs.forEach(function (job) {

        const jobCard =
            document.createElement("article");

        jobCard.className = "job-card";

        jobCard.innerHTML = `
            <h3>${job.jobTitle}</h3>

            <p>
                <strong>Company:</strong>
                ${job.company}
            </p>

            <p>
                <strong>Location:</strong>
                ${job.location || "Not provided"}
            </p>

            <p>
                <strong>Salary:</strong>
                ${job.salary
                    ? "$" + job.salary
                    : "Not provided"}
            </p>

            <p>
                <strong>Application Date:</strong>
                ${job.applicationDate}
            </p>

            <p>
                <strong>Status:</strong>
                ${job.status}
            </p>

            ${
                job.jobUrl
                    ? `
                        <p>
                            <strong>Job Link:</strong>
                            <a
                                href="${job.jobUrl}"
                                target="_blank"
                            >
                                View Job
                            </a>
                        </p>
                    `
                    : ""
            }

            ${
                job.notes
                    ? `
                        <p>
                            <strong>Notes:</strong>
                            ${job.notes}
                        </p>
                    `
                    : ""
            }

            <div class="job-actions">

                <button
                    onclick="editJob(${job.id})"
                    class="edit-button"
                >
                    Edit
                </button>

                <button
                    onclick="deleteJob(${job.id})"
                    class="delete-button"
                >
                    Delete
                </button>

            </div>
        `;

        jobsContainer.appendChild(jobCard);
    });
}


// ========================================
// DELETE JOB
// ========================================

function deleteJob(jobId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this job?");

    if (!confirmDelete) {
        return;
    }

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    const updatedJobs =
        jobs.filter(function (job) {

            return job.id !== jobId;
        });

    localStorage.setItem(
        "jobs",
        JSON.stringify(updatedJobs)
    );

    displayJobs();
}


// ========================================
// EDIT JOB
// ========================================

function editJob(jobId) {

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    const job =
        jobs.find(function (job) {

            return job.id === jobId;
        });

    if (!job) {
        alert("Job not found.");
        return;
    }

    const company =
        prompt("Company:", job.company);

    if (company === null) {
        return;
    }

    const jobTitle =
        prompt("Job Title:", job.jobTitle);

    if (jobTitle === null) {
        return;
    }

    const location =
        prompt("Location:", job.location);

    if (location === null) {
        return;
    }

    const status =
        prompt(
            "Status: Applied, Interview, Assessment, Rejected, Offer, Accepted",
            job.status
        );

    if (status === null) {
        return;
    }

    // Update the selected job
    job.company = company.trim();
    job.jobTitle = jobTitle.trim();
    job.location = location.trim();
    job.status = status.trim();

    // Save updated array
    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );

    // Refresh page content
    displayJobs();
}


// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }

            const user = {
                name: name,
                email: email,
                password: password
            };

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            alert("Registration successful!");

            window.location.href = "login.html";
        }
    );
}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const savedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );

            if (!savedUser) {

                alert("No account found. Please register first.");

                return;
            }

            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "loggedIn",
                    "true"
                );

                alert("Login successful!");

                window.location.href = "jobs.html";

            } else {

                alert("Invalid email or password.");
            }
        }
    );
}