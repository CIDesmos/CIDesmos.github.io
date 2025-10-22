// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, setDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
const db = getFirestore();
const lessons = collection(db, 'Lessons')

const review = document.getElementById('review')
const desmosDisplay = document.getElementById('frame')
const author = document.getElementById('author')
const ringContainer = document.getElementById('rings')

if (sessionStorage.getItem('username') != 'aryamanhati') {
    review.style.visibility = 'hidden'
}

review.addEventListener('click', () => {
    window.location.href = './ReviewPage/review.html'
})

var links = []
var documentNames = []
var documentName = ""
var authors = []

getDocs(lessons).then((snapShot) => {
    snapShot.docs.forEach((d) => {
        let data = d.data()

        if (data['Link'] != "") {
            links.push(data['Link'])
            authors.push(data['username'])
            documentNames.push(data['Title'])
        }
    })

    let index = Math.floor(Math.random()*links.length)
    documentName = documentNames[index]
    desmosDisplay.setAttribute('src', String(links[index]) + '?embed')
    author.innerHTML = "By " + authors[index]
})

const redirect = document.getElementById('proj-redirect')
redirect.addEventListener('click', () => {
    sessionStorage.setItem('document', documentName)
    sessionStorage.setItem('editing', 'false')
    window.location.href = '../DocumentPage/document.html'
})
