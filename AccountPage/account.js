// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getFirestore, collection, getDoc, getDocs, doc, setDoc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, updateEmail, updatePassword, signInWithEmailAndPassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js"
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
const db = getFirestore();

var userId = sessionStorage.getItem('UserId')
const docRef = doc(db, 'Users', userId)
const docSnap = await getDoc(docRef)

const userNameInput = document.getElementById('name')
const emailInput = document.getElementById('email')

userNameInput.value = docSnap.data()['userName']
emailInput.value = docSnap.data()['email']

const updateButton = document.getElementById('submit')
const deleteAccount = document.getElementById('delete-account')

const shade = document.getElementById('shade')
const ensure = document.getElementById('delete-ensure')
const ensureDelete = document.getElementById('ensure-yes')
const ensureLeave = document.getElementById('ensure-no')

updateButton.addEventListener('click', async (event) => {
    event.preventDefault()

    let userName = document.getElementById('name').value
    let email = document.getElementById('email').value
    let oPassword = document.getElementById('o-password').value
    let password = document.getElementById('password').value
    let cPassword = document.getElementById('c-password').value

    if (oPassword == "") {
        status('Previous password required', '#ff0000')
        return
    }

    let permit = (cPassword == password)
    let permitLength = (password.length > 6) || (password.length == 0)

    if (permit && permitLength) {
        let newPassword = (password == "")? oPassword : password

        await setDoc(doc(db, 'Users', userId), {
            'userName': userName,
            'email': email
        })

        await getDocs(collection(db, "Lessons")).then((snapShot) => {
            snapShot.docs.forEach((d) => {
                let data = d.data()
        
                if (sessionStorage.getItem('username') == data['username']) {
                    updateDoc(doc(db, 'Lessons', data['Title']), {
                        'username': userName
                    });
                }
            })
        })

        const auth = getAuth()

        signInWithEmailAndPassword(auth, sessionStorage.getItem('email'), oPassword)
        .then(async (userCredential) => {
            const currentUser = userCredential.user;

            updateEmail(currentUser, email)
            .then(() => {
                updatePassword(currentUser, newPassword)
                .then(() => {
                    sessionStorage.setItem('username', userName)
                    sessionStorage.setItem('email', email)
                    status('Account updated successfully!', '#0000e1', true)
                })
                .catch((error) => {
                    console.log(error)

                    status('An error has occured.', '#ff0000')
                })
            })
            .catch((error) => {
                console.log(error)

                status('An error has occured.', '#ff0000')
            })
        })
        .catch((error) => {
            console.log(error)
            status('User information is incorrect.', '#ff0000')
        })
    } else {
        if (permitLength) {
            status('Passwords do not match', '#ff0000')
        } else {
            status('Passwords need 6+ characters', '#ff0000')
        }
    }
})

deleteAccount.addEventListener('click', (event) => {
    event.preventDefault()

    shade.style.visibility = 'visible'
    ensure.style.visibility = 'visible'
    
    shade.style.transition = '200ms'
    ensure.style.transition = '200ms'

    shade.style.opacity = '0.6'
    ensure.style.opacity = '1'
})

ensureLeave.addEventListener('click', () => {
    shade.style.opacity = '0'
    ensure.style.opacity = '0'

    shade.style.visibility = 'hidden'
    ensure.style.visibility = 'hidden'
})

ensureDelete.addEventListener('click', async () => {

    let email = document.getElementById('email').value
    let oPassword = document.getElementById('o-password').value

    if (oPassword == "") {
        status('Password must be entered.', '#ff0000')
        return
    }

    const auth = getAuth()
    const credential = await EmailAuthProvider.credential(email, oPassword)
    await signInWithEmailAndPassword(auth, sessionStorage.getItem('email'), oPassword)
    .then(async (userCredential) => {
        const currentUser = userCredential.user;
        deleteUser(currentUser).then(async () => {
            let docToDelete = doc(db, 'Users', userId)

            await deleteDoc(docToDelete).then(() => {
                sessionStorage.setItem('UserId', '')
                sessionStorage.setItem('username', '')
                sessionStorage.setItem('email', '')

                status('Account deleted.', '#0000e1', true)
            })
        })
        .catch((error) => {
            status('Error deleting account.', '#ff0000')
        });
    })
    .catch((error) => {
        status('Error in information.', '#ff0000')
    });
})

const statusMessage = document.getElementById('message')

function status(message, color, v=false) {
    statusMessage.style.opacity = 0.6
    statusMessage.style.backgroundColor = color
    statusMessage.innerHTML = message
    setTimeout(()=>{
        statusMessage.style.opacity = 0;
        if (v) {
            window.location.href = '../ProjectsPage/projects.html'
        }
    },5000)
}