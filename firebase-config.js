// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCSSNnd5TZoNke_hdOyWUk4LJUv7R9BJY",
  authDomain: "quizz-app-2648e.firebaseapp.com",
  projectId: "quizz-app-2648e",
  storageBucket: "quizz-app-2648e.appspot.com",
  messagingSenderId: "627442278046",
  appId: "1:627442278046:web:2c246ed23fddc28ef1658f",
  measurementId: "G-ZWKDB0M37J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
