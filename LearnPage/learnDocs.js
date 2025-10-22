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
const searchBox = document.getElementById('query')
const searchImg = document.getElementById('search-img')

getDocs(lessons).then((snapShot) => {
    snapShot.docs.forEach((d) => {
        let data = d.data()

        if (data['published']) {
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

    title.addEventListener('click', () => {
        sessionStorage.setItem('document', data['Title'])
        sessionStorage.setItem('editing', 'false')
        window.location.href = '../DocumentPage/document.html'
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

searchBox.addEventListener('keypress', (e) => {
    if (e.key == "Enter") {
        ([...documents.children]).forEach(doc => {
            let value = searchBox.value.toLowerCase()
            let name = doc.children[0].innerHTML.toLowerCase()
            if (name[0] == "<"){
                name = doc.children[1].innerHTML.toLowerCase()
            }

            if (name.includes(value)) {
                doc.style.visibility = 'visible'
                doc.style.height = '70px'
                doc.style.marginTop = '5px'
                doc.style.marginBottom = '5px'
                doc.style.padding = '5px'
                doc.style.opacity = '1'
            } else {
                doc.style.visibility = 'hidden'
                doc.style.height = '0px'
                doc.style.marginTop = '0px'
                doc.style.marginBottom = '0px'
                doc.style.padding = '0px'
                doc.style.opacity = '0'
            }
        })
    }
})

searchImg.addEventListener('click', () => {
    ([...documents.children]).forEach(doc => {
        let value = searchBox.value.toLowerCase()
        let name = doc.children[0].innerHTML.toLowerCase()
        if (name[0] == "<"){
            name = doc.children[1].innerHTML.toLowerCase()
        }

        if (name.includes(value)) {
            doc.style.visibility = 'visible'
            doc.style.height = '70px'
            doc.style.marginTop = '5px'
            doc.style.marginBottom = '5px'
            doc.style.padding = '5px'
            doc.style.opacity = '1'
        } else {
            doc.style.visibility = 'hidden'
            doc.style.height = '0px'
            doc.style.marginTop = '0px'
            doc.style.marginBottom = '0px'
            doc.style.padding = '0px'
            doc.style.opacity = '0'
        }
    })
})

// When you click on a document thing it should make the screen a little dark and then have a pop up
// for what the graph looks liks and an option to view document
// Make sure to make the cursor turn into the click thing when hovering over clickable element after everything done