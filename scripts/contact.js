// Contact page form handling: validation + simulated send with success feedback

const form = document.getElementById("contact-form");
const errorEl = document.getElementById("form-error");
const successEl = document.getElementById("form-success");
const sendBtn = document.getElementById("send-btn");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(id) {
    return form.querySelector(`#${id}`);
}

function setInvalid(el, invalid) {
    el.classList.toggle("invalid", invalid);
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    successEl.hidden = true;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = field("name");
    const email = field("email");
    const message = field("message");

    const nameVal = name.value.trim();
    const emailVal = email.value.trim();
    const messageVal = message.value.trim();

    const nameOk = nameVal.length > 0;
    const emailOk = EMAIL_RE.test(emailVal);
    const messageOk = messageVal.length > 0;

    setInvalid(name, !nameOk);
    setInvalid(email, !emailOk);
    setInvalid(message, !messageOk);

    if (!nameOk) return showError("Please enter your name.");
    if (!emailOk) return showError("Please enter a valid email address.");
    if (!messageOk) return showError("Please write a message before sending.");

    // Simulate sending
    errorEl.hidden = true;
    successEl.hidden = true;
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    setTimeout(() => {
        successEl.hidden = false;
        form.reset();
        [name, email, message].forEach((el) => setInvalid(el, false));
        sendBtn.disabled = false;
        sendBtn.textContent = "Send message";

        // Hide the success note after a while
        setTimeout(() => {
            successEl.hidden = true;
        }, 6000);
    }, 800);
});

// Clear error state as the user types
form.addEventListener("input", (e) => {
    if (e.target.classList.contains("invalid")) {
        e.target.classList.remove("invalid");
    }
    if (!form.querySelector(".invalid")) {
        errorEl.hidden = true;
    }
});
