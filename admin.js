// Admin Panel Script
// Firebase Authentication and Firestore initialization
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login successful!");
            document.getElementById("admin-section").style.display = "block";
        })
        .catch(error => alert("Login failed: " + error.message));
}

function updateTelegramLink() {
    const link = document.getElementById("telegram-link").value;
    if (!link) return alert("Please enter a valid Telegram link");

    db.collection("settings").doc("app").set({ telegramLink: link })
        .then(() => alert("Telegram link updated successfully!"))
        .catch(err => alert("Error updating link: " + err));
}
