// ========================================
// JOBTRACK - MAIN JAVASCRIPT
// ========================================


// ========================================
// HELPER
// ========================================

const $ = id => document.getElementById(id);


// ========================================
// API FUNCTIONS
// ========================================
// ==========================================
// AUTHENTICATION
// ==========================================

function getToken() {
    return localStorage.getItem("token");
}


function getAuthHeaders() {

    const token = getToken();

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}
function requireLogin() {

    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

// GET ALL JOBS
async function getJobs() {

    const response = await fetch("/api/jobs");

    if (!response.ok) {
        throw new Error("Failed to load jobs");
    }

    return response.json();
}


// GET ONE JOB
async function getJob(id) {

    const response =
        await fetch(`/api/jobs/${id}`);

    if (!response.ok) {
        throw new Error("Failed to load job");
    }

    return response.json();
}


// CREATE JOB
async function saveJob(job) {

    const response =
        await fetch("/api/jobs", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(job)

        });


    if (!response.ok) {

        const error =
            await response.json();

        throw new Error(
            error.message ||
            "Failed to add job"
        );

    }

    return response.json();
}


// UPDATE JOB
async function updateJob(id, job) {

    const response =
        await fetch(`/api/jobs/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(job)

        });


    if (!response.ok) {

        const error =
            await response.json();

        throw new Error(
            error.message ||
            "Failed to update job"
        );

    }

    return response.json();
}


// DELETE JOB
async function deleteJob(id) {

    const response =
        await fetch(`/api/jobs/${id}`, {

            method: "DELETE"

        });


    if (!response.ok) {

        const error =
            await response.json();

        throw new Error(
            error.message ||
            "Failed to delete job"
        );

    }

    return response.json();
}



// ========================================
// ADD JOB PAGE
// ========================================

const jobForm =
    $("job-form");


if (jobForm) {

    jobForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const job = {

                company:
                    $("company").value.trim(),

                jobTitle:
                    $("jobTitle").value.trim(),

                location:
                    $("location").value.trim(),

                jobUrl:
                    $("jobUrl").value.trim(),

                salary:
                    $("salary").value
                        ? Number(
                            $("salary").value
                        )
                        : null,

                applicationDate:
                    $("applicationDate").value,

                status:
                    $("status").value,

                notes:
                    $("notes").value.trim()

            };


            // Required fields
            if (
                !job.company ||
                !job.jobTitle ||
                !job.applicationDate
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            try {

                await saveJob(job);

                alert(
                    "Job added successfully!"
                );


                window.location.href =
                    "jobs.html";


            } catch (error) {

                console.error(
                    "Add job error:",
                    error
                );

                alert(
                    error.message
                );

            }

        }
    );

}



// ========================================
// MY JOBS PAGE
// ========================================

const jobsContainer =
    $("jobs-container");

const jobTemplate =
    $("job-template");

const noJobs =
    $("no-jobs");

const searchInput =
    $("search-input");

const statusFilter =
    $("status-filter");

const sortSelect =
    $("sort-select");

const clearFilters =
    $("clear-filters");

const jobCount =
    $("job-count");


let allJobs = [];


// Load jobs automatically
if (
    jobsContainer &&
    jobTemplate
) {

    loadJobs();

}



// ========================================
// LOAD JOBS
// ========================================

async function loadJobs() {

    try {

        allJobs =
            await getJobs();


        renderJobs();


    } catch (error) {

        console.error(
            "Load jobs error:",
            error
        );


        if (noJobs) {

            noJobs.textContent =
                "Could not load jobs.";

            noJobs.hidden = false;

        }

    }

}



// ========================================
// RENDER JOBS
// ========================================

function renderJobs() {

    if (
        !jobsContainer ||
        !jobTemplate
    ) {

        return;

    }


    let jobs =
        [...allJobs];


    // ====================================
    // SEARCH
    // ====================================

    if (searchInput) {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        if (search) {

            jobs =
                jobs.filter(job => {

                    const company =
                        (job.company || "")
                            .toLowerCase();


                    const title =
                        (job.jobTitle || "")
                            .toLowerCase();


                    return (
                        company.includes(search) ||
                        title.includes(search)
                    );

                });

        }

    }



    // ====================================
    // STATUS FILTER
    // ====================================

    if (statusFilter) {

        const selectedStatus =
            statusFilter.value;


        if (
            selectedStatus &&
            selectedStatus !== "All"
        ) {

            jobs =
                jobs.filter(
                    job =>
                        job.status ===
                        selectedStatus
                );

        }

    }



    // ====================================
    // SORT
    // ====================================

    if (sortSelect) {

        const sort =
            sortSelect.value;


        jobs.sort((a, b) => {

            // Newest
            if (sort === "newest") {

                return (
                    new Date(
                        b.applicationDate
                    ) -
                    new Date(
                        a.applicationDate
                    )
                );

            }


            // Oldest
            if (sort === "oldest") {

                return (
                    new Date(
                        a.applicationDate
                    ) -
                    new Date(
                        b.applicationDate
                    )
                );

            }


            // Company A-Z
            if (sort === "company") {

                return (
                    (a.company || "")
                        .localeCompare(
                            b.company || ""
                        )
                );

            }


            // Job Title A-Z
            if (sort === "title") {

                return (
                    (a.jobTitle || "")
                        .localeCompare(
                            b.jobTitle || ""
                        )
                );

            }


            return 0;

        });

    }



    // ====================================
    // CLEAR OLD JOBS
    // ====================================

    jobsContainer.innerHTML = "";



    // ====================================
    // JOB COUNT
    // ====================================

    if (jobCount) {

        jobCount.textContent =
            `Showing ${jobs.length} of ${allJobs.length} jobs`;

    }



    // ====================================
    // EMPTY STATE
    // ====================================

    if (noJobs) {

        noJobs.hidden =
            jobs.length > 0;

    }



    // ====================================
    // CREATE JOB CARDS
    // ====================================

    jobs.forEach(job => {


        const card =
            jobTemplate.content
                .cloneNode(true);


        // ====================================
        // JOB TITLE
        // ====================================

        const title =
            card.querySelector(
                ".job-title"
            );


        if (title) {

            title.textContent =
                job.jobTitle;

        }



        // ====================================
        // COMPANY
        // ====================================

        const company =
            card.querySelector(
                ".company"
            );


        if (company) {

            company.textContent =
                job.company;

        }



        // ====================================
        // LOCATION
        // ====================================

        const location =
            card.querySelector(
                ".location"
            );


        if (location) {

            location.textContent =
                job.location ||
                "Not provided";

        }



        // ====================================
        // SALARY
        // ====================================

        const salary =
            card.querySelector(
                ".salary"
            );


        if (salary) {

            salary.textContent =
                job.salary !== null &&
                job.salary !== undefined &&
                job.salary !== ""
                    ? `$${job.salary}`
                    : "Not provided";

        }



        // ====================================
        // APPLICATION DATE
        // ====================================

        const date =
            card.querySelector(
                ".date"
            );


        if (date) {

            date.textContent =
                formatDate(
                    job.applicationDate
                );

        }



        // ====================================
        // STATUS
        // ====================================

        const status =
            card.querySelector(
                ".status"
            );


        if (status) {

            status.textContent =
                job.status;

        }



        // ====================================
        // NOTES
        // ====================================

        const notes =
            card.querySelector(
                ".notes"
            );


        if (notes) {

            notes.textContent =
                job.notes ||
                "No notes";

        }



        // ====================================
        // JOB URL
        // ====================================

        const link =
            card.querySelector(
                ".job-link"
            );


        if (link) {

            if (job.jobUrl) {

                link.href =
                    job.jobUrl;

                link.hidden = false;

            } else {

                link.hidden = true;

            }

        }



        // ====================================
        // EDIT BUTTON
        // ====================================

        const editButton =
            card.querySelector(
                ".edit-button"
            );


        if (editButton) {

            editButton.addEventListener(
                "click",
                () => {

                    openEditModal(job);

                }
            );

        }



        // ====================================
        // DELETE BUTTON
        // ====================================

        const deleteButton =
            card.querySelector(
                ".delete-button"
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                () => {

                    handleDelete(job);

                }
            );

        }



        jobsContainer.appendChild(card);

    });

}



// ========================================
// SEARCH
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderJobs
    );

}



// ========================================
// STATUS FILTER
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderJobs
    );

}



// ========================================
// SORT
// ========================================

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        renderJobs
    );

}



// ========================================
// CLEAR FILTERS
// ========================================

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";

            }


            if (statusFilter) {

                statusFilter.value =
                    "All";

            }


            if (sortSelect) {

                sortSelect.value =
                    "newest";

            }


            renderJobs();

        }
    );

}



// ========================================
// DELETE JOB
// ========================================

async function handleDelete(job) {


    const confirmed =
        confirm(
            `Are you sure you want to delete ${job.company} - ${job.jobTitle}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        await deleteJob(
            job._id
        );


        // Remove from local array
        allJobs =
            allJobs.filter(
                item =>
                    item._id !== job._id
            );


        renderJobs();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message
        );

    }

}



// ========================================
// EDIT MODAL
// ========================================

const editModal =
    $("edit-modal");

const editJobForm =
    $("edit-job-form");

const closeModal =
    $("close-modal");

const cancelEdit =
    $("cancel-edit");



// ========================================
// OPEN EDIT MODAL
// ========================================

function openEditModal(job) {

    if (!editModal) {

        return;

    }


    $("edit-job-id").value =
        job._id;


    $("edit-company").value =
        job.company || "";


    $("edit-jobTitle").value =
        job.jobTitle || "";


    $("edit-location").value =
        job.location || "";


    $("edit-jobUrl").value =
        job.jobUrl || "";


    $("edit-salary").value =
        job.salary ?? "";


    $("edit-applicationDate").value =
        formatDateForInput(
            job.applicationDate
        );


    $("edit-status").value =
        job.status;


    $("edit-notes").value =
        job.notes || "";


    editModal.hidden =
        false;

}



// ========================================
// CLOSE EDIT MODAL
// ========================================

function closeEditModal() {

    if (!editModal) {

        return;

    }


    editModal.hidden =
        true;


    if (editJobForm) {

        editJobForm.reset();

    }

}


// Close X
if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeEditModal
    );

}


// Cancel
if (cancelEdit) {

    cancelEdit.addEventListener(
        "click",
        closeEditModal
    );

}



// ========================================
// SAVE EDIT
// ========================================

if (editJobForm) {

    editJobForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                $("edit-job-id").value;


            const updatedJob = {

                company:
                    $("edit-company")
                        .value
                        .trim(),

                jobTitle:
                    $("edit-jobTitle")
                        .value
                        .trim(),

                location:
                    $("edit-location")
                        .value
                        .trim(),

                jobUrl:
                    $("edit-jobUrl")
                        .value
                        .trim(),

                salary:
                    $("edit-salary").value
                        ? Number(
                            $("edit-salary")
                                .value
                        )
                        : null,

                applicationDate:
                    $("edit-applicationDate")
                        .value,

                status:
                    $("edit-status")
                        .value,

                notes:
                    $("edit-notes")
                        .value
                        .trim()

            };


            // Validation
            if (
                !updatedJob.company ||
                !updatedJob.jobTitle ||
                !updatedJob.applicationDate
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            try {

                const savedJob =
                    await updateJob(
                        id,
                        updatedJob
                    );


                // Update local array
                allJobs =
                    allJobs.map(job => {

                        if (
                            job._id === id
                        ) {

                            return savedJob;

                        }


                        return job;

                    });


                closeEditModal();

                renderJobs();


            } catch (error) {

                console.error(
                    "Update error:",
                    error
                );


                alert(
                    error.message
                );

            }

        }
    );

}



// ========================================
// DATE FUNCTIONS
// ========================================

function formatDate(date) {

    if (!date) {

        return "Not provided";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return date;

    }


    return parsedDate.toLocaleDateString();

}



function formatDateForInput(date) {

    if (!date) {

        return "";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "";

    }


    return parsedDate
        .toISOString()
        .split("T")[0];

}



// ========================================
// DASHBOARD
// ========================================

const totalJobs =
    $("total-jobs");

const appliedJobs =
    $("applied-jobs");

const interviewJobs =
    $("interview-jobs");

const assessmentJobs =
    $("assessment-jobs");

const offerJobs =
    $("offer-jobs");

const rejectedJobs =
    $("rejected-jobs");

const acceptedJobs =
    $("accepted-jobs");


const recentJobsContainer =
    $("recent-jobs");

const noRecentJobs =
    $("no-recent-jobs");


// Load dashboard
if (totalJobs) {

    loadDashboard();

}



// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    try {

        const jobs =
            await getJobs();


        // ====================================
        // COUNT ALL STATUSES
        // ====================================

        const counts = {

            Applied:
                countStatus(
                    jobs,
                    "Applied"
                ),

            Interview:
                countStatus(
                    jobs,
                    "Interview"
                ),

            Assessment:
                countStatus(
                    jobs,
                    "Assessment"
                ),

            Offer:
                countStatus(
                    jobs,
                    "Offer"
                ),

            Rejected:
                countStatus(
                    jobs,
                    "Rejected"
                ),

            Accepted:
                countStatus(
                    jobs,
                    "Accepted"
                )

        };


        // ====================================
        // TOTAL
        // ====================================

        if (totalJobs) {

            totalJobs.textContent =
                jobs.length;

        }


        // ====================================
        // STAT CARDS
        // ====================================

        if (appliedJobs) {

            appliedJobs.textContent =
                counts.Applied;

        }


        if (interviewJobs) {

            interviewJobs.textContent =
                counts.Interview;

        }


        if (assessmentJobs) {

            assessmentJobs.textContent =
                counts.Assessment;

        }


        if (offerJobs) {

            offerJobs.textContent =
                counts.Offer;

        }


        if (rejectedJobs) {

            rejectedJobs.textContent =
                counts.Rejected;

        }


        if (acceptedJobs) {

            acceptedJobs.textContent =
                counts.Accepted;

        }


        // ====================================
        // PROGRESS BARS
        // ====================================

        updateProgress(
            "applied",
            counts.Applied,
            jobs.length
        );


        updateProgress(
            "interview",
            counts.Interview,
            jobs.length
        );


        updateProgress(
            "assessment",
            counts.Assessment,
            jobs.length
        );


        updateProgress(
            "offer",
            counts.Offer,
            jobs.length
        );


        updateProgress(
            "rejected",
            counts.Rejected,
            jobs.length
        );


        updateProgress(
            "accepted",
            counts.Accepted,
            jobs.length
        );


        // ====================================
        // RECENT JOBS
        // ====================================

        renderRecentJobs(jobs);


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}



// ========================================
// COUNT STATUS
// ========================================

function countStatus(
    jobs,
    status
) {

    return jobs.filter(
        job =>
            job.status === status
    ).length;

}



// ========================================
// UPDATE PROGRESS BAR
// ========================================

function updateProgress(
    status,
    count,
    total
) {

    const progress =
        $(`${status}-progress`);

    const progressCount =
        $(`${status}-progress-count`);


    if (!progress) {

        return;

    }


    let percentage = 0;


    if (total > 0) {

        percentage =
            (count / total) * 100;

    }


    progress.style.width =
        `${percentage}%`;


    if (progressCount) {

        progressCount.textContent =
            count;

    }

}



// ========================================
// RECENT APPLICATIONS
// ========================================

function renderRecentJobs(jobs) {

    if (!recentJobsContainer) {

        return;

    }


    recentJobsContainer.innerHTML =
        "";


    // No jobs
    if (jobs.length === 0) {

        if (noRecentJobs) {

            noRecentJobs.hidden =
                false;

        }

        return;

    }


    if (noRecentJobs) {

        noRecentJobs.hidden =
            true;

    }


    // Sort newest first
    const recentJobs =
        [...jobs]
            .sort(
                (a, b) =>
                    new Date(
                        b.applicationDate
                    ) -
                    new Date(
                        a.applicationDate
                    )
            )
            .slice(0, 5);


    recentJobs.forEach(job => {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "recent-job";


        // Build elements safely
        const info =
            document.createElement(
                "div"
            );

        info.className =
            "recent-job-info";


        const title =
            document.createElement(
                "h3"
            );

        title.textContent =
            job.jobTitle;


        const company =
            document.createElement(
                "p"
            );

        company.textContent =
            job.company;


        info.appendChild(title);

        info.appendChild(company);


        // Status area
        const statusArea =
            document.createElement(
                "div"
            );

        statusArea.className =
            "recent-job-status";


        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            "status-badge";

        badge.textContent =
            job.status;


        const date =
            document.createElement(
                "small"
            );

        date.textContent =
            formatDate(
                job.applicationDate
            );


        statusArea.appendChild(
            badge
        );

        statusArea.appendChild(
            date
        );


        article.appendChild(
            info
        );

        article.appendChild(
            statusArea
        );


        recentJobsContainer.appendChild(
            article
        );

    });

}



// ========================================
// REGISTER
// ========================================

const registerForm =
    $("register-form");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                $("name")
                    .value
                    .trim();


            const email =
                $("email")
                    .value
                    .trim();


            const password =
                $("password")
                    .value;


            const confirmPassword =
                $("confirmPassword")
                    .value;


            if (
                !name ||
                !email ||
                !password
            ) {

                alert(
                    "Please fill in all fields."
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            const user = {

                name:
                    name,

                email:
                    email,

                password:
                    password

            };


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            alert(
                "Registration successful!"
            );


            window.location.href =
                "login.html";

        }
    );

}



// ========================================
// LOGIN
// ========================================

const loginForm =
    $("login-form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                $("email")
                    .value
                    .trim();


            const password =
                $("password")
                    .value;


            const storedUser =
                localStorage.getItem(
                    "user"
                );


            if (!storedUser) {

                alert(
                    "Please register first."
                );

                return;

            }


            const user =
                JSON.parse(
                    storedUser
                );


            if (
                email !== user.email ||
                password !== user.password
            ) {

                alert(
                    "Invalid email or password."
                );

                return;

            }


            localStorage.setItem(
                "loggedIn",
                "true"
            );


            window.location.href =
                "dashboard.html";

        }
    );

}