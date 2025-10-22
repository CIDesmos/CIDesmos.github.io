const hover = document.getElementById('hover')

function setHover(elem, message) {
    elem.addEventListener('mouseenter', ()=> {
        hover.innerHTML = message

        let rect = elem.getBoundingClientRect()
        let hrect = hover.getBoundingClientRect()

        hover.style.left = (rect.left + rect.right - hrect.width)/2
        hover.style.top = rect.bottom + window.scrollY - 5

        hover.style.visibility = 'visible'
    })
    
    elem.addEventListener('mouseleave', ()=> {
        hover.style.visibility = 'hidden'
    })
}

setHover(uploadImg, 'Image Upload')
setHover(fontSize, 'Three options S M L')
setHover(align, 'Horizontal alignment')
setHover(link, 'Link to Desmos')