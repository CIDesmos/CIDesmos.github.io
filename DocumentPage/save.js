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

const save = document.getElementById("save")
const documentName = document.getElementById("title")

//
var title = sessionStorage.getItem('document')
documentName.innerHTML = title
//

// Desmos Link
addNewLink.addEventListener('click', async () => {
    changed = true

    await updateDoc(doc(db, 'Lessons', sessionStorage.getItem('document')), {
        'Link': linkInput.value
    })

    shade.style.opacity = '0'
    addLink.style.opacity = '0'

    shade.style.transition = '200ms'
    addLink.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    addLink.style.visibility = 'hidden'
})

save.addEventListener('click', async () => {
    if (String(documentName.innerHTML)[0] != "<" && String(documentName.innerHTML) != "") {
        const cover = document.getElementById('total-cover-shade');
        cover.style.opacity = 0.6;
        cover.style.pointerEvents = 'initial';

        try {
            const page = [];
            let characters = 0;
            let equations = 0;
            let images = 0;
            const imageUploadPromises = [];
            const title = sessionStorage.getItem('document');

            for (let i = 0; i < content.children.length; i++) {
                const elem = content.children[i];

                if (elem.classList.contains('textContent')) {
                    const html = elem.innerHTML !== "<br>" ? elem.innerHTML : "";
                    characters += html.length;

                    page.push({
                        type: 'textContent',
                        content: html,
                        alignment: elem.style.alignSelf,
                        size: elem.style.fontSize
                    });

                } else if (elem.classList.contains('latexContent')) {
                    equations += 1;

                    page.push({
                        type: 'latexContent',
                        content: elem.value,
                        alignment: elem.style.alignSelf,
                        width: elem.style.width
                    });

                } else if (elem.classList.contains('imageContent')) {
                    const src = elem.children[0].getAttribute('src');
                    imageUploadPromises.push(uploadImageToSupabase(src, images));

                    page.push({
                        type: 'imageContent',
                        content: images,
                        alignment: elem.style.alignSelf,
                        width: elem.style.width
                    });

                    images += 1;
                }
            }

            await Promise.all(imageUploadPromises);

            for (let i = images; i < numImages; i++) {
                await supabasePublicClient.storage
                    .from('demos26')
                    .remove([`${documentName.innerHTML}/${i}.png`]);
            }

            if (documentName.innerHTML != sessionStorage.getItem('document')) {
                for (let i = 0; i < numImages; i++) {
                    await supabasePublicClient.storage
                        .from('demos26')
                        .remove([`${sessionStorage.getItem('document')}/${i}.png`]);
                }
            }

            const snapShot = await getDocs(lessons);

            for (const d of snapShot.docs) {
                const data = d.data();

                if (data['Title'] === title) {
                    if (documentName.innerHTML === data['Title']) {
                        await updateDoc(doc(db, 'Lessons', data['Title']), {
                            Characters: characters,
                            Equations: equations,
                            Images: images,
                            content: page
                        });
                    } else {
                        const newTitle = documentName.innerHTML;

                        await setDoc(doc(db, 'Lessons', newTitle), {
                            Characters: characters,
                            Equations: equations,
                            Images: images,
                            Link: data['Link'],
                            Title: newTitle,
                            content: page,
                            published: data['published'],
                            username: data['username']
                        });

                        await deleteDoc(doc(db, 'Lessons', data['Title']));

                        sessionStorage.setItem('document', newTitle);
                    }

                    break;
                }
            }

            changed = false;

        } catch (err) {
            console.error("Error during save:", err);
            alert("There was a problem saving your document. Please try again.");
        } finally {
            cover.style.opacity = 0;
            cover.style.pointerEvents = 'none';
        }
    }
});

async function uploadImageToSupabase(base64OrUrl, index) {
    const title = sessionStorage.getItem('document');
    const filePath = `${documentName.innerHTML}/${index}.png`;

    // Convert base64 or URL to blob or file here if needed...
    const blob = await fetch(base64OrUrl).then(res => res.blob());

    const { error } = await supabasePublicClient
        .storage
        .from('demos26')
        .upload(filePath, blob, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) throw error;
}

// Blob Url to File
async function blobURLtoFile(blobURL, fileName) {
    const response = await fetch(blobURL);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
}

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function random() {
    let s = ''
    for (let i = 0; i < 10; i++) {
        s += chars[Math.floor(chars.length*Math.random())]
    }

    return s
}

async function uploadImage(url, num) {
    let file = await blobURLtoFile(url, '')

    let {data, error} = await supabasePublicClient.storage.from("demos26").upload(documentName.innerHTML + "/" + num + ".png", file)
}

// Setup
var numImages = 0
var owner = false
const editing = sessionStorage.getItem('editing') == 'true'

getDocs(lessons).then(async (snapShot) => {
    for (const d of snapShot.docs) {
        let data = d.data()

        if (data['Title'] == sessionStorage.getItem('document')) {
            let author = document.getElementById('author')
            author.innerHTML = "By " + data['username']

            let projectRedirect = document.getElementById('proj-redirect')
            if (data['Link'] != "") {
                projectRedirect.style.visibility = "visible"
                projectRedirect.style.opacity = 1
                projectRedirect.addEventListener('click', () => {
                    window.open(data['Link'], "").focus();
                })
            } else {
                projectRedirect.style.opacity = 0
                projectRedirect.style.visibility = "hidden"
            }

            for (let item of data['content']) {

                if (item['type'] == 'textContent') {
                    addText(item['content'], item['size'])
                    getElem(index).style.alignSelf = item['alignment']
                    getElem(index).spellcheck = false

                    if (data['username'] != sessionStorage.getItem('username') || !editing){
                        getElem(index).contentEditable = false
                        getElem(index).style.backgroundColor = 'transparent'
                    }
                } else if (item['type'] == 'latexContent') {
                    addLatex(item['content'])
                    getElem(index).style.alignSelf = item['alignment']
                    getElem(index).style.width = item['width']

                    if (data['username'] != sessionStorage.getItem('username') || !editing){
                        getElem(index).contentEditable = false
                    }
                } else {
                    let {data, error} = await supabasePublicClient.storage.from("demos26").getPublicUrl(sessionStorage.getItem('document') + "/" + item['content']+ ".png")
                    addImage(data['publicUrl'])
                    getElem(index).style.alignSelf = item['alignment']
                    getElem(index).style.width = item['width']
                    getElem(index).children[0].style.width = item['width']
                    numImages += 1
                }

                if (data['username'] != sessionStorage.getItem('username') || !editing){
                    getElem(index).style.pointerEvents = 'none'
                    documentName.style.pointerEvents = 'none'
                    documentName.contentEditable = false

                    tools.style.display = 'none'
                    owner = true
                } else {
                    documentName.style.backgroundColor = "#d0ffcf"
                }
            }
        }
    }

    latexEdit = -1
}).then(() => {
    const cover = document.getElementById('total-cover')
    cover.style.opacity = 0

    setTimeout(()=>{
        cover.style.zIndex = '-1000'
    },300)

    window.scrollTo(0,0)
    document.body.style.overflow = 'auto'
})

if (owner) {
    // Toolbar scrolling
    const toolsOffset = tools.getBoundingClientRect().top

    window.addEventListener('scroll', () => {
        let rect = tools.getBoundingClientRect()

        if (window.scrollY > toolsOffset) {
            tools.style.position = 'absolute'
            tools.style.top = 0
            tools.style.position = 'fixed'
            tools.style.width = 'calc(100% - 56px)'
            content.style.marginTop = '30px'
        } else {
            tools.style.position = 'relative'
            tools.style.zIndex = 0
            content.style.marginTop = '0px'
            tools.style.width = '100%'
        }
    })
}

if (editing) {
  window.addEventListener('beforeunload', function(e) {
      // Check if there are unsaved changes (using a hypothetical function)
      if (changed) {
        // Cancel the event to trigger the confirmation dialog
        e.preventDefault(); 
        // Set returnValue to a truthy value (message won't be displayed)
        e.response = 'yuh'; 
      }
  })
}
