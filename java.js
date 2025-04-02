document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("form-container");

    // Define form structures
    const forms = [
        {
            id: "feedback-form",
            title: "Feedback",
            fields: [
                { label: "How satisfied are you with our platform? (1-5)", type: "number", id: "rating", min: 1, max: 5, required: true },
                { label: "What features do you find most useful?", type: "textarea", id: "features", placeholder: "Mention features you like...", required: true },
                { label: "What improvements would you like to see?", type: "textarea", id: "improvements", placeholder: "Suggest improvements...", required: true },
                { label: "Would you like to stay anonymous?", type: "checkbox", id: "anonymous" }
            ]
        },
        {
            id: "survey-form",
            title: "Survey",
            fields: [
                { label: "How often do you use the platform?", type: "select", id: "usage", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
                { label: "Would you recommend this platform to others?", type: "select", id: "recommend", options: ["Yes", "No"] },
                { label: "Any additional comments?", type: "textarea", id: "additional-comments", placeholder: "Your thoughts..." }
            ]
        }
    ];

    // Create forms dynamically
    forms.forEach(formData => {
        const form = createForm(formData);
        formContainer.appendChild(form);
    });

    function createForm({ id, title, fields }) {
        const form = document.createElement("form");
        form.id = id;
        form.innerHTML = `<h3>${title}</h3>`;

        fields.forEach(field => {
            const label = document.createElement("label");
            label.textContent = field.label;

            let input;
            if (field.type === "textarea") {
                input = document.createElement("textarea");
                input.placeholder = field.placeholder || "";
            } else if (field.type === "select") {
                input = document.createElement("select");
                field.options.forEach(option => {
                    const opt = document.createElement("option");
                    opt.value = option.toLowerCase();
                    opt.textContent = option;
                    input.appendChild(opt);
                });
            } else {
                input = document.createElement("input");
                input.type = field.type;
                if (field.min) input.min = field.min;
                if (field.max) input.max = field.max;
                if (field.placeholder) input.placeholder = field.placeholder;
                if (field.required) input.required = true;
            }
            input.id = field.id;

            form.appendChild(label);
            form.appendChild(input);
        });

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = `Submit ${title}`;
        form.appendChild(submitButton);

        form.addEventListener("submit", handleFormSubmit);
        return form;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = {};

        form.querySelectorAll("input, textarea, select").forEach(input => {
            if (input.type === "checkbox") {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });

        saveToLocalStorage(form.id, formData);
    }

    function saveToLocalStorage(key, data) {
        let storedData = JSON.parse(localStorage.getItem(key)) || [];
        storedData.push(data);
        localStorage.setItem(key, JSON.stringify(storedData));

        document.getElementById("response-message").innerText = "Submitted successfully!";
        setTimeout(() => document.getElementById("response-message").innerText = "", 3000);
    }
});
