const jobForm =
    document.getElementById("job-form");

const successMessage =
    document.getElementById("success-message");


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


        const jobs =
            JSON.parse(localStorage.getItem("jobs")) || [];


        jobs.push(job);


        localStorage.setItem(
            "jobs",
            JSON.stringify(jobs)
        );


        if (successMessage) {

            successMessage.textContent =
                "Job application added successfully!";

        }


        jobForm.reset();


        console.log("Job saved successfully");

        console.log(job);

        console.log(jobs);

    });

}