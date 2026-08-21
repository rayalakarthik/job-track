const $ = id => document.getElementById(id);


// ================================
// API
// ================================

async function getJobs() {
    const response = await fetch("/api/jobs");

    if (!response.ok) {
        throw new Error("Failed to load jobs");
    }

    return response.json();
}


async function saveJob(job) {
    const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(job)
    });

    if (!response.ok) {
        throw new Error("Failed to add job");
    }

    return response.json();
}


async function updateJob(id, job) {
    const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(job)
    });

    if (!response.ok) {
        throw new Error("Failed to update job");
    }

    return response.json();
}


async function deleteJob(id) {
    const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete job");
    }

    return response.json();
}


// ================================
// ADD JOB
// ================================

const jobForm = $("job-form");

if (jobForm) {

    jobForm.addEventListener("submit", async event => {

        event.preventDefault();

        const job = {
            company: $("company").value.trim(),
            jobTitle: $("jobTitle").value.trim(),
            location: $("location").value.trim(),
            jobUrl: $("jobUrl").value.trim(),
            salary: $("salary").value,
            applicationDate: $("applicationDate").value,
            status: $("status").value,
            notes: $("notes").value.trim()
        };

        try {

            await saveJob(job);

            window.location.href = "jobs.html";

        } catch (error) {

            console.error(error);

            alert("Could not add job.");

        }

    });
}


// ================================
// DISPLAY JOBS
// ================================

const jobsContainer = $("jobs-container");
const jobTemplate = $("job-template");
const noJobs = $("no-jobs");


if (jobsContainer) {
    loadJobs();
}


async function loadJobs() {

    try {

        const jobs = await getJobs();

        jobsContainer.innerHTML = "";

        noJobs.hidden = jobs.length > 0;

        jobs.forEach(job => {

            const card =
                jobTemplate.content.cloneNode(true);

            card.querySelector(".job-title").textContent =
                job.jobTitle;

            card.querySelector(".company").textContent =
                job.company;

            card.querySelector(".location").textContent =
                job.location || "Not provided";

            card.querySelector(".salary").textContent =
                job.salary
                    ? `$${job.salary}`
                    : "Not provided";

            card.querySelector(".date").textContent =
                job.applicationDate;

            card.querySelector(".status").textContent =
                job.status;

            card.querySelector(".notes").textContent =
                job.notes || "No notes";

            const link =
                card.querySelector(".job-link");

            if (job.jobUrl) {
                link.href = job.jobUrl;
            } else {
                link.hidden = true;
            }


            // EDIT

            card.querySelector(".edit-button")
                .addEventListener("click", () => {

                    editJob(job);

                });


            // DELETE

            card.querySelector(".delete-button")
                .addEventListener("click", async () => {

                    if (!confirm("Delete this job?")) {
                        return;
                    }

                    try {

                        await deleteJob(job.id);

                        loadJobs();

                    } catch (error) {

                        console.error(error);

                        alert("Could not delete job.");

                    }

                });


            jobsContainer.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        noJobs.textContent =
            "Could not load jobs.";

        noJobs.hidden = false;

    }
}


// ================================
// EDIT JOB
// ================================

async function editJob(job) {

    const company =
        prompt("Company:", job.company);

    if (company === null) return;


    const jobTitle =
        prompt("Job Title:", job.jobTitle);

    if (jobTitle === null) return;


    const location =
        prompt("Location:", job.location);

    if (location === null) return;


    const status =
        prompt(
            "Status:",
            job.status
        );

    if (status === null) return;


    const updatedJob = {
        ...job,
        company,
        jobTitle,
        location,
        status
    };


    try {

        await updateJob(
            job.id,
            updatedJob
        );

        loadJobs();

    } catch (error) {

        console.error(error);

        alert("Could not update job.");

    }
}


// ================================
// DASHBOARD
// ================================

if ($("total-jobs")) {
    loadDashboard();
}


async function loadDashboard() {

    try {

        const jobs = await getJobs();

        $("total-jobs").textContent =
            jobs.length;

        $("applied-jobs").textContent =
            countStatus(jobs, "Applied");

        $("interview-jobs").textContent =
            countStatus(jobs, "Interview");

        $("offer-jobs").textContent =
            countStatus(jobs, "Offer");

        $("rejected-jobs").textContent =
            countStatus(jobs, "Rejected");

    } catch (error) {

        console.error(error);

    }
}


function countStatus(jobs, status) {

    return jobs.filter(
        job => job.status === status
    ).length;

}


// ================================
// REGISTER
// ================================

const registerForm = $("register-form");


if (registerForm) {

    registerForm.addEventListener("submit", event => {

        event.preventDefault();

        const name =
            $("name").value.trim();

        const email =
            $("email").value.trim();

        const password =
            $("password").value;

        const confirmPassword =
            $("confirmPassword").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }


        localStorage.setItem(
            "user",
            JSON.stringify({
                name,
                email,
                password
            })
        );


        alert("Registration successful!");

        window.location.href =
            "login.html";

    });

}


// ================================
// LOGIN
// ================================

const loginForm = $("login-form");


if (loginForm) {

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            $("email").value.trim();

        const password =
            $("password").value;

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );


        if (!user) {

            alert("Please register first.");

            return;

        }


        if (
            email !== user.email ||
            password !== user.password
        ) {

            alert("Invalid email or password.");

            return;

        }


        localStorage.setItem(
            "loggedIn",
            "true"
        );


        window.location.href =
            "dashboard.html";

    });

}