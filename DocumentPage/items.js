const content = document.getElementById("content")
const cText = "#90f0d8"

var index = -1;

function getElem(i) {
    return [...content.children][i]
}

function removeElem(i) {
    content.removeChild(getElem(i))
}

function getIndex(e) {
    for (let i = 0; i < content.children.length; i++) {
        if ([...content.children][i] == e) {
            return i;
        }
    }
}

function getSelected() {
    let a = document.getSelection().anchorOffset;
    let b = document.getSelection().focusOffset;
    let start = Math.min(a, b)
    let end = Math.max(a, b)

    return getElem(index).innerHTML.slice(start, end);
}

function getSelectedRange() {
    let a = document.getSelection().anchorOffset;
    let b = document.getSelection().focusOffset;
    let start = Math.min(a, b)
    let end = Math.max(a, b)

    return [start, end];
}

function getCursor() {
    return document.getSelection().focusOffset;
}

function addText(value='', size='16px') {
    changed = true
    let elem = document.createElement('p');
    elem.setAttribute('contenteditable', true)
    elem.setAttribute('class', 'textContent')
    elem.innerHTML = value;
    elem.style.fontSize = size

    try{
        let priorElem = getElem(index)

        if (priorElem.getAttribute('class') == 'textContent') {
            priorElem.style.backgroundColor = 'transparent'
            elem.style.backgroundColor = cText
        }
    } catch {

    }

    // Positioning

    if (content.children.length == index || content.children.length == index + 1) {
        content.appendChild(elem)
        index = content.children.length - 1
    } else {
        content.insertBefore(elem, getElem(index + 1))
        index += 1
    }

    // Events

    elem.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            e.preventDefault()

            addText()
        } else if (e.key == "Backspace" && getSelected().length == 0 && getCursor() == 0) {
            e.preventDefault()

            let text = elem.innerHTML

            if (content.children.length > 1) {
                if (index > 0) {
                    getElem(index - 1).focus()

                    if (text != "<br>" && getElem(index - 1).getAttribute('class') == "textContent") {
                        getElem(index - 1).innerHTML += text;
                    }
                } else {
                    getElem(index + 1).focus()
                }

                content.removeChild(elem)
            }

            index -= 1

            if (getElem(index).getAttribute('class') == 'textContent') {
                getElem(index).style.backgroundColor = cText
            }
        }
    })
    
    elem.addEventListener('click', () => {
        if (getElem(index).getAttribute('class') == 'textContent') {
            getElem(index).style.backgroundColor = 'transparent'
        }

        index = getIndex(elem)
        elem.style.backgroundColor = cText
        latexEdit = -1
    })

    elem.focus()
    elem.style.alignSelf = 'center'
}

var latexEdit = -1;
var resizableLatex = false;
var resizingLatex = false;
var latexSide = ''

function addLatex(value="") {
    let elem = document.createElement('math-field');
    elem.setAttribute('contenteditable', true)
    elem.setAttribute('class', 'latexContent')

    if (value != "") {
        elem.value = value;
    }

    // Positioning

    if (content.children.length == index || content.children.length == index + 1) {
        content.appendChild(elem)
        index = content.children.length - 1
    } else {
        content.insertBefore(elem, getElem(index + 1))
        index += 1
    }

    // Events

    elem.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            e.preventDefault()

            addText()
        } else if (e.key == "Backspace" && elem.value == "") {
            e.preventDefault()

            if (content.children.length > 1) {
                if (index > 0) {
                    getElem(index - 1).focus()

                    if (getElem(index - 1).getAttribute('class') == 'textContent') {
                        getElem(index - 1).style.backgroundColor = cText
                    }

                    if (getElem(index - 1).getAttribute('class') != "latexContent") {
                        latexEdit = -1
                    }

                    index -= 1
                } else {
                    getElem(index + 1).focus()

                    if (getElem(index + 1).getAttribute('class') == 'textContent') {
                        getElem(index + 1).style.backgroundColor = cText
                    }

                    if (getElem(index + 1).getAttribute('class') != "latexContent") {
                        latexEdit = -1
                    }
                }

                content.removeChild(elem)
            } else {
                content.removeChild(elem)
                addText()
            }
        }
    })

    elem.addEventListener('click', () => {
        if (imageEdit > -1 && getElem(imageEdit).getAttribute('class') == 'imageContent') {
            imageFocus(getElem(imageEdit))
        }
        index = getIndex(elem)
        latexEdit = index
    })

    elem.focus()
    latexEdit = index

    elem.style.alignSelf = 'center'
}

var imageEdit = -1;

function addImage(url) {
    changed = true
    try {
        if (getElem(index).getAttribute('class') == 'textContent') {
            getElem(index).style.backgroundColor = 'transparent'
        }
    } catch {

    }


    let elem = document.createElement('div');
    elem.setAttribute('class', 'imageContent')

    let img = document.createElement('img')
    img.setAttribute('src', url)
    elem.appendChild(img)

    // Positioning

    if (content.children.length == index || content.children.length == index + 1) {
        content.appendChild(elem)
        index = content.children.length - 1
    } else {
        content.insertBefore(elem, getElem(index + 1))
        index += 1
    }

    // Events

    elem.addEventListener('click', () => {
        if (getElem(index).getAttribute('class') == 'textContent') {
            getElem(index).style.backgroundColor = 'transparent'
        }

        if (!(resizable || resizing)) {
            imageFocus(elem)
        }
        latexEdit = -1
    })

    elem.addEventListener('mouseenter', () => {
        mouseOverImage = true;
    })

    elem.addEventListener('mouseleave', () => {
        mouseOverImage = false;
    })

    elem.style.alignSelf = 'center'
}

function imageFocus(elem) {
    if (imageEdit == getIndex(elem)) {
        try {
            getElem(index).focus()
        } catch(e) {

        }
        elem.style.border = "1px solid rgb(0,0,0)"
        elem.style.padding = "1px"

        imageEdit = -1;
    } else {
        if (imageEdit > -1) {
            imageFocus(getElem(imageEdit))
        }

        index = getIndex(elem)
        elem.style.border = "2px solid #009402"
        elem.style.padding = "0px"

        imageEdit = getIndex(elem);
    }
}

document.addEventListener('keyup', (e) => {
    changed = true

    if (imageEdit > -1) {
        if (e.key == "Enter") {
            addText()
            getElem(index).style.backgroundColor = cText
            imageFocus(getElem(imageEdit))
        } else if (e.key == "Backspace") {
            imageEdit = -1

            removeElem(index)

            if (index > 0) {
                index -= 1

                if (getElem(index).getAttribute('class') == 'textContent') {
                    getElem(index).style.backgroundColor = cText
                }
            } else {
                addText()
            }

            try {
                getElem(index).focus()
            } catch(e) {

            }
        }
    }
})

var resizable = false;
var resizing = false;
var mouseOverImage = false;
var side = ''

document.addEventListener('mousedown', (e) => {
    if (resizable || resizing) {
        e.preventDefault()
        resizing = true
        changed = true
    } else {
        if (imageEdit > -1 && !mouseOverImage) {
            imageFocus(getElem(imageEdit))
        }
    }

    if (resizableLatex || resizingLatex) {
        e.preventDefault()
        resizingLatex = true
    }
})

document.addEventListener('mouseup', () => {
    if (resizing) {
        resizing = false
        side = ''
    } else if (resizingLatex) {
        resizingLatex = false
        latexSide = ''
    }
})

document.addEventListener('mousemove', (e) => {
    e.preventDefault()

    if (imageEdit > -1) {
        changed = true
        let elem = getElem(index)
        let rect = elem.getBoundingClientRect()

        let condR = ((elem.style.alignSelf == '' || elem.style.alignSelf == 'self-start' || elem.style.alignSelf == 'center')? (distance(e.clientX, e.clientY, rect.right, rect.bottom) < 80): false)
        let condL = ((elem.style.alignSelf == 'self-end' || elem.style.alignSelf == 'center')? (distance(e.clientX, e.clientY, rect.left, rect.bottom) < 80): false)

        if (condR || condL || resizing) {
            if (condL) {
                elem.style.cursor = 'sw-resize'
                if (!resizing) {
                    side = "left"
                }
            } else {
                elem.style.cursor = 'se-resize'
                if (!resizing) {
                    side = "right"
                }
            }
            resizable = true;
        } else {
            elem.style.cursor = 'auto'
            resizable = false
        }

        if (resizing) {
            elem.style.borderColor = "rgb(109, 109, 255)"
    
            let width = (side == "left")? (rect.right - e.clientX):(e.clientX - rect.left)
            elem.style.width = width.toFixed(2) + "px"
            elem.children[0].style.width = width.toFixed(2) + "px"
        } else {
            elem.style.borderColor = "#009402"
        }
    } else if (latexEdit > -1) {
        let elem = getElem(index)
        let rect = elem.getBoundingClientRect()

        let condL = (elem.style.alignSelf == 'self-end' || elem.style.alignSelf == 'center')? (distance(e.clientX, 0, rect.left, 0) < 80): false
        let condR = (elem.style.alignSelf != 'self-end')? (distance(e.clientX, 0, rect.right, 0) < 80): false

        if (e.clientY >= rect.top && e.clientY <= rect.bottom && (condL || condR)) {
            resizableLatex = true
            if (condL) {
                latexSide = 'left'
                if (!resizingLatex) {
                    elem.style.cursor = 'w-resize'
                }
            } else {
                latexSide = 'right'
                if (!resizingLatex) {
                    elem.style.cursor = 'e-resize'
                }
            }
        } else {
            resizableLatex = false
            if (!resizingLatex) {
                elem.style.cursor = 'auto'
            }
        }

        if (resizingLatex) {
            let width = (latexSide == 'left')? (rect.right - e.clientX):(e.clientX - rect.left)
            elem.style.width = width.toFixed(2) + "px"
        }
    }
})

function distance(x1, y1, x2, y2) {
    return (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2);
}
