document.getElementById('login').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('quiz-section').style.display = 'block';
    } catch (e) {
        alert('Login failed: ' + e.message);
    }
});

document.getElementById('save-quiz').addEventListener('click', async () => {
    const data = JSON.parse(document.getElementById('quiz-data').value);
    const today = new Date().toISOString().split('T')[0];
    await db.collection('quizzes').doc(today).set({ questions: data });
    alert('Quiz saved for today!');
});
