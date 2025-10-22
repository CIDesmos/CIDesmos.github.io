const tools = document.getElementById('tools')

const uploadImg = document.getElementById("uploadImg")
var fileGetter = document.getElementById("fileGetter")
const fontSize = document.getElementById("fontSize")
const align = document.getElementById("align")
const link = document.getElementById("link")

const shade = document.getElementById('shade')
const addLink = document.getElementById('add-link')
const linkInput = addLink.children[1].children[0].children[1]
const addNewLink = addLink.children[1].children[1]
const returnLink = addLink.children[0].children[0]

uploadImg.addEventListener("click", () => {
    fileGetter.click()
})

const fontDict = {
    "16px": "24px",
    "24px": "8px",
    "8px": "16px"
}

fontSize.addEventListener("click", () => {
    if (getElem(index).getAttribute('class') == 'textContent') {
        getElem(index).style.fontSize = fontDict[getElem(index).style.fontSize]
    }
    changed = true
})

fileGetter.addEventListener("change", appendImages)

function appendImages() {
    changed = true
    let images = fileGetter.files

    let elem = document.createElement("input")
    elem.setAttribute('multiple', 'multiple')
    elem.setAttribute('id', 'fileGetter')
    elem.setAttribute('accept', 'image/png, image/jpg, image/jpeg')
    elem.setAttribute('type', 'file')
    elem.style.display = 'none'
    elem.addEventListener("change", appendImages)

    tools.removeChild(fileGetter)
    tools.insertBefore(elem, uploadImg)

    fileGetter = elem

    if (getElem(index).getAttribute('class') == 'textContent') {
        let text = getElem(index).innerHTML
        let range = getSelectedRange()
        
        if (range[0] == 0) {
            if (range[1] == text.length) {
                removeElem(index)
            } else {
                getElem(index).innerHTML = text.slice(range[1], text.length)
            }

            index -= 1

            for (let i = 0; i < images.length; i++) {
                addImage(URL.createObjectURL(images[i]))
            }
        } else {
            getElem(index).innerHTML = text.slice(0, range[0])

            if (range[1] != text.length) {
                addText(text.slice(range[1], text.length))
                index -= 1
            }

            for (let i = 0; i < images.length; i++) {
                addImage(URL.createObjectURL(images[i]))
            }
        }
    } else {
        for (let i = 0; i < images.length; i++) {
            addImage(URL.createObjectURL(images[i]))
        }
    }

    fileGetter.blur()
    imageFocus(getElem(index))
}

var alignDict = {
    '':'center',
    'self-start':'center',
    'center':'self-end',
    'self-end':'self-start'
}

align.addEventListener("click", () => {
    let elem = getElem(index)

    elem.style.alignSelf = alignDict[elem.style.alignSelf]
    changed = true
})

link.addEventListener("click", () => {
    shade.style.visibility = 'visible'
    addLink.style.visibility = 'visible'

    shade.style.transition = '200ms'
    addLink.style.transition = '200ms'

    shade.style.opacity = '0.6'
    addLink.style.opacity = '1'
})

returnLink.addEventListener('click', () => {
    shade.style.opacity = '0'
    addLink.style.opacity = '0'

    shade.style.transition = '200ms'
    addLink.style.transition = '200ms'

    shade.style.visibility = 'hidden'
    addLink.style.visibility = 'hidden'
})