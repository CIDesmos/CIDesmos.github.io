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

const documents = document.getElementById('documents')
const shade = document.getElementById('shade')
const docView = document.getElementById('document-view')
const returnButton = document.getElementById('return')
const title = document.getElementsByClassName('label')[0]
const hLine = document.getElementById('hLine')
const frame = document.getElementById('frame')
const okay = document.getElementById('okay')
const notOkay = document.getElementById('not-okay')

var okayState = -1

okay.addEventListener('click', () => {
    if (okayState == 1) {
        okay.style.backgroundColor = 'rgb(255,255,255)'
        okayState = -1
    } else {
        okay.style.backgroundColor = "rgb(38, 205, 72)"
        okayState = 1
    }
})

notOkay.addEventListener('click', () => {
    if (okayState == 0) {
        notOkay.style.backgroundColor = 'rgb(255,255,255)'
        okayState = -1
    } else {
        notOkay.style.backgroundColor = "rgb(38, 205, 72)"
        okayState = 0
    }
})

getDocs(lessons).then((snapShot) => {
    snapShot.docs.forEach((d) => {
        let data = d.data()

        if (data['reviewing']) {
            addDoc(data)
        }
    })
}).then(() => {
    const cover = document.getElementById('total-cover')
    cover.style.opacity = 0

    setTimeout(()=>{
        cover.style.display = 'none'
    },300)
})

function addDoc(data) {
    let elem = document.createElement('div')
    elem.setAttribute('class', 'document')

    if (data['Link'] != '') {
        let viewProjContainer = document.createElement('div')
        viewProjContainer.setAttribute('class', 'view-container')

        let viewProj = document.createElement('div')
        viewProj.setAttribute('class', 'view-proj')

        viewProj.innerHTML = 'View Site'

        viewProjContainer.appendChild(viewProj)
        elem.appendChild(viewProjContainer)

        viewProj.addEventListener('click', () => {
            popUp(data)
        })
    }

    let title = document.createElement('div')
    title.setAttribute('class', 'title')
    title.innerHTML = data['Title']

    title.addEventListener('click', async () => {
        if (okayState == -1) {
            sessionStorage.setItem('document', data['Title'])
            sessionStorage.setItem('editing', 'false')
            window.location.href = '../DocumentPage/document.html'
        } else {
            if (okayState == 1) {
                await updateDoc(doc(db, 'Lessons', data['Title']), {
                    'published': true,
                    'reviewing': false
                })
            } else {
                await updateDoc(doc(db, 'Lessons', data['Title']), {
                    'reviewing': false
                })
            }

            window.location.href = './review.html'
        }
    })
    
    let specifics = document.createElement('div')
    specifics.setAttribute('class', 'specifics')

    let details = ['Characters', 'Images', 'username']

    for (let i = 0; i < 3; i++) {
        let specific = document.createElement('div')
        specific.setAttribute('class', 'specific')
        specific.innerHTML = ((i==2)? 'By': details[i]) + " - " + data[details[i]]
        if (i == 2) {
            specific.style.opacity = 0.6
        }

        specifics.appendChild(specific)
    }

    elem.appendChild(title)
    elem.appendChild(specifics)
    documents.appendChild(elem)
}

function popUp(data) {
    frame.setAttribute('src', data['Link'] + '?embed')

    shade.style.visibility = 'visible'
    docView.style.visibility = 'visible'

    shade.style.transition = '200ms'
    docView.style.transition = '200ms'

    shade.style.opacity = '0.6'
    docView.style.opacity = '1'

    title.innerHTML = data['Title']
    hLine.style.width = Math.max(data['Title'].length*10, 200) + "px"
}

returnButton.addEventListener('click', () => {
    frame.setAttribute('src', 'https://www.desmos.com/calculator/' + '' + '?embed')

    shade.style.opacity = '0'
    docView.style.opacity = '0'

    shade.style.transition = '200ms'
    docView.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    docView.style.visibility = 'hidden'
})
