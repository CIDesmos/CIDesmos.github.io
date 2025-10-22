const loginButton = document.getElementById('submit')

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, getDoc, doc, setDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTFcoGEb0M5kq6muwcvTVScYWwpQCmp38",
    authDomain: "lessons-1c2f7.firebaseapp.com",
    projectId: "lessons-1c2f7",
    storageBucket: "lessons-1c2f7.firebasestorage.app",
    messagingSenderId: "653725225214",
    appId: "1:653725225214:web:333d48acd88290be5e95af",
    measurementId: "G-TWN0LL7Y77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

loginButton.addEventListener('click', (event) => {
    event.preventDefault()
        
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (email == "" || password == "") {
        status("Fill out the email and password.", "#ff0000")
        return
    }

    const auth = getAuth();
    const db = getFirestore()

    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;

        if (user.emailVerified) {
            const docRef = doc(db, "Users", user.uid)
            const docSnap = await getDoc(docRef)

            sessionStorage.setItem('username', docSnap.data()['userName'])
            sessionStorage.setItem('UserId', user.uid)
            sessionStorage.setItem('email', docSnap.data()['email'])
            status('Login successful!', '#0000e1', true)
        } else {
            status('Please Verify your Email.', '#ff0000')
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/invalid-credentials') {
            status('Incorrect email or password', '#ff0000')
        } else {
            status('User does not exist', '#ff0000')
        }
    })
})

const statusMessage = document.getElementById('message')

function status(message, color, v=false) {
    statusMessage.style.opacity = 0.6
    statusMessage.style.backgroundColor = color
    statusMessage.innerHTML = message
    setTimeout(()=>{
        statusMessage.style.opacity = 0;
        if (v) {
            window.location.href = "../index.html";
        }
    },3000)
}

forgot.addEventListener('click', () => {
    const auth = getAuth();

    const email = document.getElementById('email').value

    if (email == "" || String(email[0]) == "<") {
        status('Please enter your email.', '#ff0000')
        return
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            status('Reset email sent', '#000e1')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            status('Email does not exist.', '#ff0000')
        });
})