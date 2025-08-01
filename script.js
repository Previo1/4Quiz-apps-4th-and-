let userId = localStorage.getItem('userId') || 'user_' + Date.now();
localStorage.setItem('userId', userId);

let coins = 0;
// Telegram Channel Link
const telegramChannelLink = "https://t.me/quizzsapp"; // अपना लिंक डालें

// Join Telegram button click event
document.getElementById("join-telegram").href = https://t.me/quizzsapp;

// Load user profile from Firebase
async function loadUserProfile() {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        coins = data.coins || 0;
        document.getElementById('coin-count').innerText = coins;
    } else {
        await db.collection('users').doc(userId).set({ coins: 0, boosters: [], username: userId });
    }
}

// Add coins and update Firebase
async function addCoins(amount, reason = "Reward") {
    coins += amount;
    document.getElementById('coin-count').innerText = coins;
    await db.collection('users').doc(userId).update({ coins });
    addRewardHistory(reason, amount);
    coinAnimation();
}

// Coin animation
function coinAnimation() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = (window.innerWidth / 2) + 'px';
    coin.style.top = (window.innerHeight / 2) + 'px';
    document.getElementById('coin-animation').appendChild(coin);
    setTimeout(() => coin.remove(), 1000);
}

// Spin wheel
document.getElementById('spin-wheel').addEventListener('click', async () => {
    const today = new Date().toISOString().split('T')[0];
    const userDoc = await db.collection('users').doc(userId).get();
    const data = userDoc.data();
    if (data.lastSpin === today) {
        alert('You already used your spin today!');
        return;
    }
    const reward = Math.floor(Math.random() * 50) + 10;
    await addCoins(reward, "Spin Wheel");
    await db.collection('users').doc(userId).update({ lastSpin: today });
    alert(`You won ${reward} coins from Spin Wheel!`);
});

// Load leaderboard
async function loadLeaderboard() {
    const snapshot = await db.collection('users').orderBy('coins', 'desc').limit(10).get();
    const leaderboard = document.getElementById('leaderboard-list');
    leaderboard.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        leaderboard.innerHTML += `<li>${data.username || doc.id}: ${data.coins} coins</li>`;
    });
}

// Save profile
document.getElementById('save-profile').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        await db.collection('users').doc(userId).update({ username });
        alert('Profile updated!');
        loadLeaderboard();
    }
});

// Start quiz (load from firebase)
document.getElementById('start-quiz').addEventListener('click', async () => {
    const today = new Date().toISOString().split('T')[0];
    const quizDoc = await db.collection('quizzes').doc(today).get();
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    if (quizDoc.exists) {
        const quiz = quizDoc.data().questions;
        quiz.forEach((q, i) => {
            const div = document.createElement('div');
            div.innerHTML = `<p>${q.question}</p>
                ${q.options.map((opt, j) =>
                    `<button onclick="checkAnswer(${i}, ${j}, ${q.answer})">${opt}</button>`
                ).join('<br>')}`;
            container.appendChild(div);
        });
    } else {
        container.innerHTML = "<p>No quiz for today</p>";
    }
});

// Check answer
async function checkAnswer(qIndex, selected, correct) {
    if (selected === correct) {
        await addCoins(10, "Correct Answer");
        alert("Correct!");
    } else {
        alert("Wrong!");
    }
}

// Reward history
async function addRewardHistory(reason, amount) {
    const historyRef = db.collection('users').doc(userId).collection('history');
    await historyRef.add({ reason, amount, date: new Date().toISOString() });
}

// Load user data
window.onload = async () => {
    await loadUserProfile();
    await loadLeaderboard();
};
