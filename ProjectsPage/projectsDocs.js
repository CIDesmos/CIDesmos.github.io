// Supabase
const supabaseURL = "https://evditplpyjmmyhprfmkt.supabase.co";
const supabaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZGl0cGxweWptbXlocHJmbWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDc1NjUsImV4cCI6MjA2Mjk4MzU2NX0.imLrJ4Pib_pcteNja_Bw6RdCTv76kVnep2y_lyEKD9Y";

const supabasePublicClient = supabase.createClient(supabaseURL, supabaseKEY);

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
const returnButtons = document.getElementsByClassName('return')
const titles = document.getElementsByClassName('label')
const hLine = document.getElementById('hLine')
const frame = document.getElementById('frame')
const add = document.getElementById('add')
const addView = document.getElementById('add-view')
const deleteView = document.getElementById('delete-view')

const publicity = document.getElementById('public')

const inputs = document.getElementsByClassName('new-entry')
const create = document.getElementById('create')
const deleteDocument = document.getElementById('delete')

getDocs(lessons).then((snapShot) => {
    let published = 0
    let unpublished = 0
    let reviewing = 0

    snapShot.docs.forEach((d) => {
        let data = d.data()

        if (data['username'] == sessionStorage.getItem('username')) {
            addDoc(data)
            published += (data['published'])? 1 : 0
            unpublished += (data['published'])? 0 : 1
            reviewing += (data['reviewing'])? 1 : 0
        }
    })

    let publishedDisp = document.getElementById('published')
    publishedDisp.innerHTML = String(published) + " published"

    let unpublishedDisp = document.getElementById('unpublished')
    unpublishedDisp.innerHTML = String(unpublished) + " unpublished"

    let reviewingDisp = document.getElementById('reviewing')
    reviewingDisp.innerHTML = String(reviewing) + " under review"

    let totalProjects = published + unpublished
    if (totalProjects == 0) {
        publicity.style.transition = '0ms'
        deleteDocument.style.transition = '0ms'
        publicity.style.visibility = 'hidden'
        deleteDocument.style.visibility = 'hidden'

        // In case a user has no projects
        let noProjects = document.createElement('p')
        noProjects.setAttribute('id', 'no-projects')
        noProjects.innerHTML = 'Nothing here yet'
        documents.appendChild(noProjects)
    }
}).then(() => {
    const cover = document.getElementById('total-cover')
    cover.style.opacity = 0

    setTimeout(()=>{
        cover.style.display = 'none'
    },300)
})

var docToBeDeleted =["none", 0]

function addDoc(data) {
    let container = document.createElement('div')
    container.setAttribute('class', 'document-container')

    let elem = document.createElement('div')
    elem.setAttribute('class', 'document')

    let viewProj;

    if (data['Link'] != '') {
        let viewProjContainer = document.createElement('div')
        viewProjContainer.setAttribute('class', 'view-container')

        viewProj = document.createElement('div')
        let published = (data['published'])? 'view-proj':((data['reviewing'])? 'view-proj-rev':'view-proj-unpub')
        viewProj.setAttribute('class', published)
        
        viewProj.innerHTML = 'View Site'

        viewProjContainer.appendChild(viewProj)

        elem.appendChild(viewProjContainer)

        viewProj.addEventListener('click', () => {
            popUp(data)
        })
    }

    let title = document.createElement('div')
    let published = (data['published'])? 'title':((data['reviewing'])? 'title-rev':'title-unpub')
    title.setAttribute('class', published)
    title.innerHTML = data['Title']

    title.addEventListener('click', async () => {
        if (!deleting) {
            sessionStorage.setItem('document', data['Title'])
            sessionStorage.setItem('editing', String((title.getAttribute('class') == 'title-unpub')))
            window.location.href = '../DocumentPage/document.html'
        } else {
            docToBeDeleted = [data['Title'], data['Images']]

            shade.style.visibility = 'visible'
            deleteView.style.visibility = 'visible'

            shade.style.transition = '200ms'
            deleteView.style.transition = '200ms'

            shade.style.opacity = '0.6'
            deleteView.style.opacity = '1'

            /*
            let docToDelete = doc(db, "Lessons", data['Title'])

            await deleteDoc(docToDelete).then(async () => {
                for (let i = 0; i < data['Images']; i++) {
                    const { dat, error } = await supabasePublicClient.storage.from('demos26').remove([data['Title'] + "/" + String(i) + '.png'])
                }
            }).then(() => {
                window.location.href = './projects.html'
            })*/
        }
    })
    
    let specifics = document.createElement('div')
    specifics.setAttribute('class', 'specifics')

    let details = ['Characters', 'Images']

    for (let i = 0; i < 2; i++) {
        let specific = document.createElement('div')
        specific.setAttribute('class', 'specific')
        specific.innerHTML = details[i] + " - " + data[details[i]]

        specifics.appendChild(specific)
    }

    elem.appendChild(title)
    elem.appendChild(specifics)
    container.appendChild(elem)

    // Public to Private enabling

    let publicSwitch = document.createElement('div')
    publicSwitch.setAttribute('class', 'public')

    if (data['published']) {
        publicSwitch.setAttribute('class', 'public')
    } else {
        publicSwitch.setAttribute('class', ((data['reviewing'])? 'public-rev':'public-unpub'))
    }

    publicSwitch.addEventListener('click', async () => {
        let currentPub = (publicSwitch.getAttribute('class') == 'public')? true:false
        let reviewing = (publicSwitch.getAttribute('class') == 'public-rev')

        if (currentPub) {
            let publishedDisp = document.getElementById('published')
            let publishedCt = parseInt(publishedDisp.innerHTML[0])
            let unpublishedDisp = document.getElementById('unpublished')
            let unpublishedCt = parseInt(unpublishedDisp.innerHTML[0])

            publicSwitch.setAttribute('class', 'public-unpub')
            title.setAttribute('class', 'title-unpub')
            try{
                viewProj.setAttribute('class', 'view-proj-unpub')
            }catch{

            }

            publishedDisp.innerHTML = String(publishedCt - 1) + " published"
            unpublishedDisp.innerHTML = String(unpublishedCt + 1) + " unpublished"
        } else {
            let reviewingDisp = document.getElementById('reviewing')
            let reviewing = parseInt(reviewingDisp.innerHTML[0])
            
            if (reviewing) {
                publicSwitch.setAttribute('class', 'public-unpub')
                title.setAttribute('class', 'title-unpub')
                try{
                    viewProj.setAttribute('class', 'view-proj-unpub')
                }catch{
                    
                }
                reviewingDisp.innerHTML = String(reviewing - 1) + " under review"
            } else {
                publicSwitch.setAttribute('class', 'public-rev')
                title.setAttribute('class', 'title-rev')
                try{
                    viewProj.setAttribute('class', 'view-proj-rev')
                }catch{
                
                }
                reviewingDisp.innerHTML = String(reviewing + 1) + " under review"
                notice()
            }
        }

        await updateDoc(doc(db, 'Lessons', data['Title']), {
            'reviewing': !currentPub && !reviewing,
            'published': false
        })
    })

    container.appendChild(publicSwitch)

    documents.appendChild(container)

    publicity.style.visibility = 'visible'

    try {
        document.removeChild(document.getElementById('no-projects'))
    } catch {

    }
}

// Delete confirmation
let deleteYes = document.getElementById('delete-yes')

deleteYes.addEventListener('click', async () => {
    let docToDelete = doc(db, "Lessons", docToBeDeleted[0])

    await deleteDoc(docToDelete).then(async () => {
        for (let i = 0; i < docToBeDeleted[1]; i++) {
            const { dat, error } = await supabasePublicClient.storage.from('demos26').remove([docToBeDeleted[0] + "/" + String(i) + '.png'])
        }
    }).then(() => {
        window.location.href = './projects.html'
    })
})

let deleteNo = document.getElementById('delete-no')

deleteNo.addEventListener('click', async () => {
    docToBeDeleted = "none"

    shade.style.opacity = '0'
    deleteView.style.opacity = '0'

    shade.style.transition = '200ms'
    deleteView.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    deleteView.style.visibility = 'hidden'
})

function popUp(data) {
    frame.setAttribute('src', data['Link'] + '?embed')

    shade.style.visibility = 'visible'
    docView.style.visibility = 'visible'

    shade.style.transition = '200ms'
    docView.style.transition = '200ms'

    shade.style.opacity = '0.6'
    docView.style.opacity = '1'

    titles[0].innerHTML = data['Title']
    hLine.style.width = Math.max(data['Title'].length*10, 200) + "px"
}

returnButtons[0].addEventListener('click', () => {
    frame.setAttribute('src', 'https://www.desmos.com/calculator/' + '' + '?embed')

    shade.style.opacity = '0'
    docView.style.opacity = '0'

    shade.style.transition = '200ms'
    docView.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    docView.style.visibility = 'hidden'
})

// New Document

add.addEventListener('click', () => {
    shade.style.visibility = 'visible'
    addView.style.visibility = 'visible'

    shade.style.transition = '200ms'
    addView.style.transition = '200ms'

    shade.style.opacity = '0.6'
    addView.style.opacity = '1'
})

returnButtons[1].addEventListener('click', () => {
    shade.style.opacity = '0'
    addView.style.opacity = '0'

    shade.style.transition = '200ms'
    addView.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    addView.style.visibility = 'hidden'
})

create.addEventListener('click', async () => {
    if (inputs[0].value != "") {
        let title = inputs[0].value

        await setDoc(doc(db, 'Lessons', title), {
            'Characters': 0,
            'Equations': 0,
            'Images': 0,
            'Link': inputs[1].value,
            'Title': title,
            'content': [{'type': 'textContent', 'content': '', 'alignment': 'center'}],
            'published': false,
            'reviewing': false,
            'username': sessionStorage.getItem('username')
        })
    }

    window.location.href = "../ProjectsPage/projects.html"
})

var publicEdit = false

publicity.addEventListener('click', () => {
    let Elements1 = document.getElementsByClassName('public')
    let Elements2 = document.getElementsByClassName('public-unpub')
    let Elements3 = document.getElementsByClassName('public-rev')

    for (let i = 0; i < Elements1.length; i++) {
        let elem = Elements1[i]

        if (!publicEdit) {
            elem.style.width = '30px'
            elem.style.borderWidth = '1px'
            elem.style.marginLeft = '20px'
            elem.style.marginRight = '20px'
        } else {
            elem.style.width = '0px'
            elem.style.borderWidth = '0px'
            elem.style.marginLeft = '0px'
            elem.style.marginRight = '0px'
        }
    }

    for (let i = 0; i < Elements2.length; i++) {
        let elem = Elements2[i]

        if (!publicEdit) {
            elem.style.width = '30px'
            elem.style.borderWidth = '1px'
            elem.style.marginLeft = '20px'
            elem.style.marginRight = '20px'
        } else {
            elem.style.width = '0px'
            elem.style.borderWidth = '0px'
            elem.style.marginLeft = '0px'
            elem.style.marginRight = '0px'
        }
    }

    for (let i = 0; i < Elements3.length; i++) {
        let elem = Elements3[i]

        if (!publicEdit) {
            elem.style.width = '30px'
            elem.style.borderWidth = '1px'
            elem.style.marginLeft = '20px'
            elem.style.marginRight = '20px'
        } else {
            elem.style.width = '0px'
            elem.style.borderWidth = '0px'
            elem.style.marginLeft = '0px'
            elem.style.marginRight = '0px'
        }
    }

    publicEdit = !publicEdit
})

// Deleting documents
var deleting = false
var previousClasses = []

deleteDocument.addEventListener('click', () => {
    let redColor = '#850000'

    if (!deleting) {
        for (let d of [...documents.children]) {
            d.children[0].style.borderColor = redColor

            if (d.children[0].children.length == 2) {
                d.children[0].children[0].style.color = redColor
                d.children[0].children[1].style.borderColor = redColor
                d.children[0].children[1].children[0].style.color = redColor
                d.children[0].children[1].children[1].style.color = redColor

                previousClasses.push(d.children[0].children[0].getAttribute('class'))
                d.children[0].children[0].setAttribute('class', 'title-delete')
            } else {
                d.children[0].children[0].style.color = redColor
                d.children[0].children[0].style.borderColor = redColor
                d.children[0].children[1].style.color = redColor
                d.children[0].children[2].style.borderColor = redColor
                d.children[0].children[2].children[0].style.color = redColor
                d.children[0].children[2].children[1].style.color = redColor

                previousClasses.push(d.children[0].children[0].children[0].getAttribute('class'))
                d.children[0].children[0].children[0].setAttribute('class', 'view-delete')
                previousClasses.push(d.children[0].children[1].getAttribute('class'))
                d.children[0].children[1].setAttribute('class', 'title-delete')
            }
        }
    } else {
        for (let d of [...documents.children]) {
            d.children[0].style.borderColor = '#000'
            
            if (d.children[0].children.length == 2) {
                d.children[0].children[0].style.color = '#000'
                d.children[0].children[1].style.borderColor = '#000'
                d.children[0].children[1].children[0].style.color = '#000'
                d.children[0].children[1].children[1].style.color = '#000'

                d.children[0].children[0].setAttribute('class', previousClasses.shift())
            } else {
                d.children[0].children[0].style.color = "#000"
                d.children[0].children[0].style.borderColor = "#000"
                d.children[0].children[1].style.color = "#000"
                d.children[0].children[2].style.borderColor = "#000"
                d.children[0].children[2].children[0].style.color = "#000"
                d.children[0].children[2].children[1].style.color = "#000"

                d.children[0].children[0].children[0].setAttribute('class', previousClasses.shift())
                d.children[0].children[1].setAttribute('class', previousClasses.shift())
            } 
        }

        previousClasses = []
    }

    deleting = !deleting
})

const noticeText = document.getElementById('notice')

function notice() {
    shade.style.visibility = 'visible'
    noticeText.style.visibility = 'visible'

    shade.style.transition = '200ms'
    noticeText.style.transition = '200ms'

    shade.style.opacity = '0.6'
    noticeText.style.opacity = '1'

    noticeText.style.pointerEvents = "all"
}

const reviewOk = document.getElementById('proceed')

reviewOk.addEventListener('click', () => {
    shade.style.opacity = '0'
    noticeText.style.opacity = '0'

    shade.style.transition = '200ms'
    noticeText.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    noticeText.style.visibility = 'hidden'

    noticeText.style.pointerEvents = "none"
})

// Make sure to make the cursor turn into the click thing when hovering over clickable element after everything done