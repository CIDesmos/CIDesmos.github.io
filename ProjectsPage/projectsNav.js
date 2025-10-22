// Initializer
try{
    if (sessionStorage.getItem('count') == 1) {
    } else {
        sessionStorage.setItem('username', "")
        sessionStorage.setItem('editing', false)
        sessionStorage.setItem('document', "")
        sessionStorage.setItem('email', "")
        sessionStorage.setItem('UserId', "")
        sessionStorage.setItem('count', 1)
    }
} catch {
    sessionStorage.setItem('username', "")
    sessionStorage.setItem('editing', false)
    sessionStorage.setItem('document', "")
    sessionStorage.setItem('email', "")
    sessionStorage.setItem('UserId', "")
    sessionStorage.setItem('count', 1)
}

const home = document.getElementById('home')
const getStarted = document.getElementById('get-started')
const learn = document.getElementById('learn')
const login = document.getElementById('login')
const signup = document.getElementById('signup')
const username = document.getElementById('username')
const popDown = document.getElementById('userPopDown')
const popDownElems = document.getElementsByClassName('pop-down')

home.addEventListener('click', () => {
    window.location.href = '../index.html'
})

getStarted.addEventListener('click', () => {
    if (started.style.opacity == 1) {
        started.style.opacity = 0
        started.style.visibility = 'hidden'
    } else {
        started.style.opacity = 1
        started.style.visibility = 'visible'
    }
})

learn.addEventListener('click', () => {
    window.location.href = '../LearnPage/learn.html'
})

var popDownDisplay = false

if (sessionStorage.getItem('username') == "") {
    username.style.display = "none"
    popDown.style.display = "none"
    for (let elem of popDownElems) {
        elem.style.display = "none"
    }

    login.addEventListener('click', () => {
        window.location.href = '../LoginPage/login.html'
    })

    signup.addEventListener('click', () => {
        window.location.href = '../SignupPage/signup.html'
    })
} else {
    login.style.display = 'none'
    document.getElementsByClassName('vLine')[1].style.display = 'none'
    signup.style.display = 'none'

    username.innerHTML = (sessionStorage.getItem('username').length > 10)? sessionStorage.getItem('username'): "AAAAAAAAAA"

    let rect = username.getBoundingClientRect()

    popDown.style.top = rect.bottom + 5
    for (let i = 0; i < 3; i++) {
        let elem = popDownElems[i]
        let hrect = elem.getBoundingClientRect()

        elem.style.top = 35*i + rect.bottom
        elem.style.left = (rect.right + rect.left - hrect.width)/2

        if (i == 2) {
            popDown.style.height = 35*i + rect.bottom - rect.bottom + 40
        } else if (i == 0) {
            popDown.style.width = hrect.width + 20
            popDown.style.left = (rect.right + rect.left - hrect.width)/2 - 10
        }
    }

    username.innerHTML = sessionStorage.getItem('username')

    username.addEventListener('click', () => {
        if (!popDownDisplay) {
            popDown.style.visibility = "visible"
            for (let elem of popDownElems) {
                elem.style.transition = '200ms'
                elem.style.visibility = "visible"
            }
            popDownDisplay = true
        } else {
            popDown.style.visibility = "hidden"
            for (let elem of popDownElems) {
                elem.style.transition = '0ms'
                elem.style.visibility = "hidden"
            }
            popDownDisplay = false
        }
    })

    const documents = document.getElementById('my-documents')
    const account = document.getElementById('my-account')
    const logout = document.getElementById('logout')

    account.addEventListener('click', () => {
        window.location.href = '../AccountPage/account.html'
    })

    logout.addEventListener('click', () => {
        // All Storage Resets
        sessionStorage.setItem('username', "")
        sessionStorage.setItem('document', "")
        sessionStorage.setItem('email', "")

        window.location.href = '../index.html'
    })
}

// Need to make 'How to start coding with desmos' page for getStarted to redirect to

const started = document.getElementById('started')
const desmosBasics = document.getElementsByClassName('pop-down-2')[0]
const codeBasics = document.getElementsByClassName('pop-down-2')[1]

started.style.left = getStarted.getBoundingClientRect().left - 40
started.style.opacity = 0
started.style.visibility = "hidden"

desmosBasics.addEventListener('click', () => {
    sessionStorage.setItem('document', 'Basic Intro to Desmos')
    window.location.href = '../DocumentPage/document.html'
})

codeBasics.addEventListener('click', () => {
    sessionStorage.setItem('document', 'Basic Object Types in Desmos')
    window.location.href = '../DocumentPage/document.html'
})